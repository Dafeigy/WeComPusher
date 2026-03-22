use serde::{Deserialize, Serialize};
use tauri_plugin_store::StoreExt;
use sha2::{Sha256, Digest};

#[derive(Debug, Clone, Serialize, Deserialize)]
struct AuthData {
    password_hash: String,
}

#[tauri::command]
pub fn is_password_set(app: tauri::AppHandle) -> Result<bool, String> {
    let store = app.store("auth.json").map_err(|e| e.to_string())?;
    let has_password: bool = store.get("password_hash").is_some();
    Ok(has_password)
}

#[tauri::command]
pub fn set_password(app: tauri::AppHandle, password: String) -> Result<(), String> {
    let store = app.store("auth.json").map_err(|e| e.to_string())?;
    
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let hash = hasher.finalize();
    let hash_string = hex::encode(hash);
    
    store.set("password_hash", hash_string);
    store.save().map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn verify_password(app: tauri::AppHandle, password: String) -> Result<bool, String> {
    let store = app.store("auth.json").map_err(|e| e.to_string())?;
    
    let stored_hash: String = store
        .get("password_hash")
        .and_then(|v| v.as_str().map(|s| s.to_string()))
        .ok_or_else(|| "Password not set".to_string())?;
    
    let mut hasher = Sha256::new();
    hasher.update(password.as_bytes());
    let hash = hasher.finalize();
    let input_hash = hex::encode(hash);
    
    Ok(stored_hash == input_hash)
}

#[tauri::command]
pub fn reset_all_data(app: tauri::AppHandle) -> Result<(), String> {
    let store = app.store("auth.json").map_err(|e| e.to_string())?;
    store.clear();
    store.save().map_err(|e| e.to_string())?;
    
    let group_store = app.store("groups.json").map_err(|e| e.to_string())?;
    group_store.clear();
    group_store.save().map_err(|e| e.to_string())?;
    
    Ok(())
}
