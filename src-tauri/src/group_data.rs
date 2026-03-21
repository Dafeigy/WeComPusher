use serde::{Deserialize, Serialize};
use tauri_plugin_store::StoreExt;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Group {
    pub id: Option<i64>,
    pub name: String,
    pub url: String,
}

#[tauri::command]
pub fn get_all_groups(app: tauri::AppHandle) -> Result<Vec<Group>, String> {
    let store = app.store("groups.json").map_err(|e| e.to_string())?;
    let groups: Vec<Group> = store
        .get("groups")
        .and_then(|v| serde_json::from_value(v).ok())
        .unwrap_or_else(|| Vec::new());
    Ok(groups)
}

#[tauri::command]
pub fn add_group(app: tauri::AppHandle, group: Group) -> Result<(), String> {
    let store = app.store("groups.json").map_err(|e| e.to_string())?;
    let mut groups: Vec<Group> = store
        .get("groups")
        .and_then(|v| serde_json::from_value(v).ok())
        .unwrap_or_else(|| Vec::new());
    
    let mut new_group = group;
    let max_id = groups.iter().filter_map(|g| g.id).max().unwrap_or(0);
    new_group.id = Some(max_id + 1);
    
    groups.push(new_group);
    store.set("groups", serde_json::to_value(groups).map_err(|e| e.to_string())?);
    store.save().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn update_group(app: tauri::AppHandle, group: Group) -> Result<(), String> {
    let store = app.store("groups.json").map_err(|e| e.to_string())?;
    let mut groups: Vec<Group> = store
        .get("groups")
        .and_then(|v| serde_json::from_value(v).ok())
        .unwrap_or_else(|| Vec::new());
    
    if let Some(id) = group.id {
        if let Some(index) = groups.iter().position(|g| g.id == Some(id)) {
            groups[index] = group;
            store.set("groups", serde_json::to_value(groups).map_err(|e| e.to_string())?);
            store.save().map_err(|e| e.to_string())?;
            return Ok(());
        }
    }
    Err("Group not found".to_string())
}

#[tauri::command]
pub fn delete_group(app: tauri::AppHandle, id: i64) -> Result<(), String> {
    let store = app.store("groups.json").map_err(|e| e.to_string())?;
    let mut groups: Vec<Group> = store
        .get("groups")
        .and_then(|v| serde_json::from_value(v).ok())
        .unwrap_or_else(|| Vec::new());
    
    groups.retain(|g| g.id != Some(id));
    store.set("groups", serde_json::to_value(groups).map_err(|e| e.to_string())?);
    store.save().map_err(|e| e.to_string())?;
    Ok(())
}
