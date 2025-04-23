use axum::{
    Json, Router,
    extract::{Path, Query, State},
    http::StatusCode,
    routing::{delete, get, post, put},
};
use serde::Deserialize;
use sqlx::Row;
use uuid::Uuid;

use crate::db::DbPool;
use crate::error::{AppError, Result};
use crate::models::*;

// Route setup
pub fn create_router(pool: DbPool) -> Router {
    Router::new()
        // Event routes
        .route("/events", get(list_events))
        .route("/events", post(create_event))
        .route("/events/{id}", get(get_event))
        .route("/events/{id}", put(update_event))
        .route("/events/{id}", delete(delete_event))
        // Group routes
        .route("/groups", get(list_groups))
        .route("/groups", post(create_group))
        .route("/groups/{id}", get(get_group))
        .route("/groups/{id}", put(update_group))
        .route("/groups/{id}", delete(delete_group))
        .route("/events/{event_id}/groups", get(list_event_groups))
        // Group member routes
        .route("/members", post(create_member))
        .route("/members/{id}", delete(delete_member))
        .route("/groups/{group_id}/members", get(list_group_members))
        .with_state(pool)
}

// Query parameters
#[derive(Debug, Deserialize)]
pub struct Pagination {
    pub page: Option<usize>,
    pub limit: Option<usize>,
}

impl Default for Pagination {
    fn default() -> Self {
        Self {
            page: Some(1),
            limit: Some(10),
        }
    }
}

// Event handlers
async fn list_events(
    State(pool): State<DbPool>,
    Query(pagination): Query<Pagination>,
) -> Result<Json<Vec<Event>>> {
    let page = pagination.page.unwrap_or(1);
    let limit = pagination.limit.unwrap_or(10);
    let offset = (page - 1) * limit;

    let events =
        sqlx::query_as::<_, Event>("SELECT * FROM events ORDER BY date_time DESC LIMIT ? OFFSET ?")
            .bind(limit as i64)
            .bind(offset as i64)
            .fetch_all(&pool)
            .await
            .map_err(AppError::Database)?;

    Ok(Json(events))
}

async fn create_event(
    State(pool): State<DbPool>,
    Json(event): Json<CreateEventRequest>,
) -> Result<Json<Event>> {
    let event_id = Uuid::new_v4();
    let result = sqlx::query_as::<_, Event>(
        "INSERT INTO events (id, name, date_time, group_size_limit, location) 
         VALUES (?, ?, ?, ?, ?) 
         RETURNING *",
    )
    .bind(event_id.to_string())
    .bind(&event.name)
    .bind(event.date_time)
    .bind(event.group_size_limit)
    .bind(&event.location)
    .fetch_one(&pool)
    .await
    .map_err(AppError::Database)?;

    Ok(Json(result))
}

async fn get_event(
    State(pool): State<DbPool>,
    Path(id): Path<String>,
) -> Result<Json<EventWithGroups>> {
    let event = sqlx::query_as::<_, Event>("SELECT * FROM events WHERE id = ?")
        .bind(&id)
        .fetch_optional(&pool)
        .await
        .map_err(AppError::Database)?
        .ok_or_else(|| AppError::NotFound(format!("Event with ID {} not found", id)))?;

    let groups = sqlx::query_as::<_, Group>(
        "SELECT * FROM groups WHERE event_id = ? ORDER BY created_at DESC",
    )
    .bind(&id)
    .fetch_all(&pool)
    .await
    .map_err(AppError::Database)?;

    let event_with_groups = EventWithGroups { event, groups };

    Ok(Json(event_with_groups))
}

async fn update_event(
    State(pool): State<DbPool>,
    Path(id): Path<String>,
    Json(event): Json<CreateEventRequest>,
) -> Result<Json<Event>> {
    let result = sqlx::query_as::<_, Event>(
        "UPDATE events 
         SET name = ?, date_time = ?, group_size_limit = ?, location = ?
         WHERE id = ?
         RETURNING *",
    )
    .bind(&event.name)
    .bind(event.date_time)
    .bind(event.group_size_limit)
    .bind(&event.location)
    .bind(&id)
    .fetch_optional(&pool)
    .await
    .map_err(AppError::Database)?
    .ok_or_else(|| AppError::NotFound(format!("Event with ID {} not found", id)))?;

    Ok(Json(result))
}

async fn delete_event(State(pool): State<DbPool>, Path(id): Path<String>) -> Result<StatusCode> {
    // First, check if the event exists
    let exists = sqlx::query("SELECT 1 FROM events WHERE id = ?")
        .bind(&id)
        .fetch_optional(&pool)
        .await
        .map_err(AppError::Database)?
        .is_some();

    if !exists {
        return Err(AppError::NotFound(format!(
            "Event with ID {} not found",
            id
        )));
    }

    // Use a transaction to delete the event and related groups/members
    let mut tx = pool.begin().await.map_err(AppError::Database)?;

    // Delete group members related to this event's groups
    sqlx::query(
        "DELETE FROM group_members 
         WHERE group_id IN (SELECT id FROM groups WHERE event_id = ?)",
    )
    .bind(&id)
    .execute(&mut *tx)
    .await
    .map_err(AppError::Database)?;

    // Delete groups related to this event
    sqlx::query("DELETE FROM groups WHERE event_id = ?")
        .bind(&id)
        .execute(&mut *tx)
        .await
        .map_err(AppError::Database)?;

    // Delete the event
    sqlx::query("DELETE FROM events WHERE id = ?")
        .bind(&id)
        .execute(&mut *tx)
        .await
        .map_err(AppError::Database)?;

    // Commit the transaction
    tx.commit().await.map_err(AppError::Database)?;

    Ok(StatusCode::NO_CONTENT)
}

// Group handlers
async fn list_groups(
    State(pool): State<DbPool>,
    Query(pagination): Query<Pagination>,
) -> Result<Json<Vec<Group>>> {
    let page = pagination.page.unwrap_or(1);
    let limit = pagination.limit.unwrap_or(10);
    let offset = (page - 1) * limit;

    let groups = sqlx::query_as::<_, Group>(
        "SELECT * FROM groups ORDER BY created_at DESC LIMIT ? OFFSET ?",
    )
    .bind(limit as i64)
    .bind(offset as i64)
    .fetch_all(&pool)
    .await
    .map_err(AppError::Database)?;

    Ok(Json(groups))
}

async fn create_group(
    State(pool): State<DbPool>,
    Json(group): Json<CreateGroupRequest>,
) -> Result<Json<Group>> {
    // Check if the event exists
    let event_exists = sqlx::query("SELECT 1 FROM events WHERE id = ?")
        .bind(&group.event_id)
        .fetch_optional(&pool)
        .await
        .map_err(AppError::Database)?
        .is_some();

    if !event_exists {
        return Err(AppError::NotFound(format!(
            "Event with ID {} not found",
            group.event_id
        )));
    }

    // Insert the new group
    let result = sqlx::query_as::<_, Group>(
        "INSERT INTO groups (event_id, creator_name, creator_email, group_name, accepts_others, project_description) 
         VALUES (?, ?, ?, ?, ?, ?) 
         RETURNING *"
    )
    .bind(&group.event_id)
    .bind(&group.creator_name)
    .bind(&group.creator_email)
    .bind(&group.group_name)
    .bind(group.accepts_others)
    .bind(&group.project_description)
    .fetch_one(&pool)
    .await
    .map_err(AppError::Database)?;

    // Also add the creator as the first group member
    for member in group.members {
        sqlx::query(
            "INSERT INTO group_members (group_id, name, email) 
         VALUES (?, ?, ?)",
        )
        .bind(result.id)
        .bind(&member.name)
        .bind(&member.email)
        .execute(&pool)
        .await
        .map_err(AppError::Database)?;
    }

    Ok(Json(result))
}

async fn get_group(
    State(pool): State<DbPool>,
    Path(id): Path<i64>,
) -> Result<Json<GroupWithMembers>> {
    let group = sqlx::query_as::<_, Group>("SELECT * FROM groups WHERE id = ?")
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(AppError::Database)?
        .ok_or_else(|| AppError::NotFound(format!("Group with ID {} not found", id)))?;

    let members =
        sqlx::query_as::<_, GroupMember>("SELECT * FROM group_members WHERE group_id = ?")
            .bind(id)
            .fetch_all(&pool)
            .await
            .map_err(AppError::Database)?;

    let group_with_members = GroupWithMembers { group, members };

    Ok(Json(group_with_members))
}

async fn update_group(
    State(pool): State<DbPool>,
    Path(group_id): Path<i64>,
    Json(update): Json<UpdateGroupRequest>,
) -> Result<Json<GroupWithMembers>> {
    // Start a transaction
    let mut tx = pool.begin().await.map_err(AppError::Database)?;

    // Check if the group exists
    let group = sqlx::query_as::<_, Group>("SELECT * FROM groups WHERE id = ?")
        .bind(group_id)
        .fetch_optional(&mut *tx)
        .await
        .map_err(AppError::Database)?;

    match group {
        Some(g) => g,
        None => {
            return Err(AppError::NotFound(format!(
                "Group with ID {} not found",
                group_id
            )));
        }
    };

    // Update the group details
    let updated_group = sqlx::query_as::<_, Group>(
        "UPDATE groups 
         SET creator_name = ?, creator_email = ?, group_name = ?, accepts_others = ?, project_description = ? 
         WHERE id = ? 
         RETURNING *"
    )
    .bind(&update.creator_name)
    .bind(&update.creator_email)
    .bind(&update.group_name)
    .bind(update.accepts_others)
    .bind(&update.project_description)
    .bind(group_id)
    .fetch_one(&mut *tx)
    .await
    .map_err(AppError::Database)?;

    // Delete all existing members
    sqlx::query("DELETE FROM group_members WHERE group_id = ?")
        .bind(group_id)
        .execute(&mut *tx)
        .await
        .map_err(AppError::Database)?;

    // Add all new members
    let mut new_members = Vec::with_capacity(update.members.len());
    for member in update.members {
        let new_member = sqlx::query_as::<_, GroupMember>(
            "INSERT INTO group_members (group_id, name, email) 
             VALUES (?, ?, ?) 
             RETURNING *",
        )
        .bind(group_id)
        .bind(&member.name)
        .bind(&member.email)
        .fetch_one(&mut *tx)
        .await
        .map_err(AppError::Database)?;

        new_members.push(new_member);
    }

    // Commit the transaction
    tx.commit().await.map_err(AppError::Database)?;

    // Return the updated group with its new members
    Ok(Json(GroupWithMembers {
        group: updated_group,
        members: new_members,
    }))
}

async fn delete_group(State(pool): State<DbPool>, Path(id): Path<i64>) -> Result<StatusCode> {
    // First, check if the group exists
    let exists = sqlx::query("SELECT 1 FROM groups WHERE id = ?")
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(AppError::Database)?
        .is_some();

    if !exists {
        return Err(AppError::NotFound(format!(
            "Group with ID {} not found",
            id
        )));
    }

    // Use a transaction to delete the group and its members
    let mut tx = pool.begin().await.map_err(AppError::Database)?;

    // Delete group members
    sqlx::query("DELETE FROM group_members WHERE group_id = ?")
        .bind(id)
        .execute(&mut *tx)
        .await
        .map_err(AppError::Database)?;

    // Delete the group
    sqlx::query("DELETE FROM groups WHERE id = ?")
        .bind(id)
        .execute(&mut *tx)
        .await
        .map_err(AppError::Database)?;

    // Commit the transaction
    tx.commit().await.map_err(AppError::Database)?;

    Ok(StatusCode::NO_CONTENT)
}

async fn list_event_groups(
    State(pool): State<DbPool>,
    Path(event_id): Path<String>,
) -> Result<Json<Vec<GroupWithMembers>>> {
    // First check if the event exists
    let event_exists = sqlx::query("SELECT 1 FROM events WHERE id = ?")
        .bind(&event_id)
        .fetch_optional(&pool)
        .await
        .map_err(AppError::Database)?
        .is_some();

    if !event_exists {
        return Err(AppError::NotFound(format!(
            "Event with ID {} not found",
            event_id
        )));
    }

    // Get all groups for this event
    let groups = sqlx::query_as::<_, Group>(
        "SELECT * FROM groups WHERE event_id = ? ORDER BY created_at DESC",
    )
    .bind(&event_id)
    .fetch_all(&pool)
    .await
    .map_err(AppError::Database)?;

    if groups.is_empty() {
        return Ok(Json(Vec::new()));
    }

    // Extract all group IDs for the query
    let group_ids: Vec<i64> = groups.iter().map(|group| group.id).collect();

    // Get all members for all groups in a single query
    let members = sqlx::query_as::<_, GroupMember>(
        "SELECT * FROM group_members WHERE group_id IN (SELECT id FROM groups WHERE event_id = ?)",
    )
    .bind(&event_id)
    .fetch_all(&pool)
    .await
    .map_err(AppError::Database)?;

    // Organize members by group_id for efficient lookup
    let mut members_by_group: std::collections::HashMap<i64, Vec<GroupMember>> =
        std::collections::HashMap::new();
    for member in members {
        members_by_group
            .entry(member.group_id)
            .or_insert_with(Vec::new)
            .push(member);
    }

    // Create GroupWithMembers for each group
    let groups_with_members = groups
        .into_iter()
        .map(|group| {
            let group_members = members_by_group.remove(&group.id).unwrap_or_else(Vec::new);

            GroupWithMembers {
                group,
                members: group_members,
            }
        })
        .collect();

    Ok(Json(groups_with_members))
}

// Group member handlers
async fn create_member(
    State(pool): State<DbPool>,
    Json(member): Json<CreateMemberRequest>,
) -> Result<Json<GroupMember>> {
    // Check if the group exists
    let group = sqlx::query_as::<_, Group>("SELECT * FROM groups WHERE id = ?")
        .bind(member.group_id)
        .fetch_optional(&pool)
        .await
        .map_err(AppError::Database)?
        .ok_or_else(|| {
            AppError::NotFound(format!("Group with ID {} not found", member.group_id))
        })?;

    // Check if the group accepts other members
    if !group.accepts_others {
        return Err(AppError::BadRequest(format!(
            "Group with ID {} does not accept new members",
            member.group_id
        )));
    }

    // Get the event to check group size limit
    let event = sqlx::query_as::<_, Event>("SELECT * FROM events WHERE id = ?")
        .bind(&group.event_id)
        .fetch_one(&pool)
        .await
        .map_err(AppError::Database)?;

    // Count current group members
    let member_count: i64 = sqlx::query("SELECT COUNT(*) FROM group_members WHERE group_id = ?")
        .bind(member.group_id)
        .fetch_one(&pool)
        .await
        .map_err(AppError::Database)?
        .get(0);

    // Check if adding another member would exceed the limit
    if member_count >= event.group_size_limit {
        return Err(AppError::BadRequest(format!(
            "Group size limit of {} has been reached",
            event.group_size_limit
        )));
    }

    // Insert the new member
    let result = sqlx::query_as::<_, GroupMember>(
        "INSERT INTO group_members (group_id, name, email) 
         VALUES (?, ?, ?) 
         RETURNING *",
    )
    .bind(member.group_id)
    .bind(&member.name)
    .bind(&member.email)
    .fetch_one(&pool)
    .await
    .map_err(AppError::Database)?;

    Ok(Json(result))
}

async fn delete_member(State(pool): State<DbPool>, Path(id): Path<i64>) -> Result<StatusCode> {
    // Check if the member exists
    let exists = sqlx::query("SELECT 1 FROM group_members WHERE id = ?")
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(AppError::Database)?
        .is_some();

    if !exists {
        return Err(AppError::NotFound(format!(
            "Member with ID {} not found",
            id
        )));
    }

    // Delete the member
    sqlx::query("DELETE FROM group_members WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(AppError::Database)?;

    Ok(StatusCode::NO_CONTENT)
}

async fn list_group_members(
    State(pool): State<DbPool>,
    Path(group_id): Path<i64>,
) -> Result<Json<Vec<GroupMember>>> {
    // Check if the group exists
    let group_exists = sqlx::query("SELECT 1 FROM groups WHERE id = ?")
        .bind(group_id)
        .fetch_optional(&pool)
        .await
        .map_err(AppError::Database)?
        .is_some();

    if !group_exists {
        return Err(AppError::NotFound(format!(
            "Group with ID {} not found",
            group_id
        )));
    }

    let members =
        sqlx::query_as::<_, GroupMember>("SELECT * FROM group_members WHERE group_id = ?")
            .bind(group_id)
            .fetch_all(&pool)
            .await
            .map_err(AppError::Database)?;

    Ok(Json(members))
}
