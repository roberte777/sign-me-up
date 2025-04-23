use serde::{Deserialize, Serialize};
use sqlx::{
    FromRow,
    types::chrono::{DateTime, Utc},
};

// Event model
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Event {
    pub id: String,
    pub name: String,
    pub date_time: DateTime<Utc>,
    pub group_size_limit: i64,
    pub location: String,
    pub created_at: Option<DateTime<Utc>>,
}

// For creating new events
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateEventRequest {
    pub name: String,
    pub date_time: DateTime<Utc>,
    pub group_size_limit: i64,
    pub location: String,
}

// Group model
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Group {
    pub id: i64,
    pub event_id: String,
    pub creator_name: String,
    pub creator_email: String,
    pub group_name: String,
    pub accepts_others: bool,
    pub project_description: Option<String>,
    pub created_at: Option<DateTime<Utc>>,
}

// For creating new groups
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateGroupRequest {
    pub event_id: String,
    pub creator_name: String,
    pub creator_email: String,
    pub group_name: String,
    pub accepts_others: bool,
    pub project_description: Option<String>,
    pub members: Vec<MembersForCreateGroupRequest>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct MembersForCreateGroupRequest {
    pub name: String,
    pub email: Option<String>,
}

// Group member model
#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct GroupMember {
    pub id: i64,
    pub group_id: i64,
    pub name: String,
    pub email: Option<String>,
}

// For creating new group members
#[derive(Debug, Serialize, Deserialize)]
pub struct CreateMemberRequest {
    pub group_id: i64,
    pub name: String,
    pub email: Option<String>,
}

// Extended group with members
#[derive(Debug, Serialize, Deserialize)]
pub struct GroupWithMembers {
    #[serde(flatten)]
    pub group: Group,
    pub members: Vec<GroupMember>,
}

// Event with group count
#[derive(Debug, Serialize, Deserialize)]
pub struct EventWithGroups {
    #[serde(flatten)]
    pub event: Event,
    pub groups: Vec<Group>,
}
