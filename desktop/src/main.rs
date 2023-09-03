// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{
    api::process::{Command, CommandEvent},
    App,
};

fn start_server(app: &mut App) {
    let sidecar = Command::new_sidecar("kirana-server");
    match sidecar {
        Ok(command) => {
            let spawn_result = command.spawn();
            match spawn_result {
                Ok((mut receiver, _)) => loop {
                    match receiver.blocking_recv() {
                        Some(event) => match event {
                            CommandEvent::Stdout(out) => {
                                println!("stdout: {}", out);
                                if out == "Serving on http://127.0.0.1:5000" {
                                    break;
                                } else {
                                    println!("unexpected stdout: {}", out);
                                }
                            }
                            CommandEvent::Stderr(err) => {
                                println!("stderr: {}", err);
                                app.handle().exit(4);
                            }
                            CommandEvent::Error(err) => {
                                println!("sidecar error has occurred: {}", err);
                                app.handle().exit(5);
                            }
                            CommandEvent::Terminated(terminated) => {
                                println!(
                                    "sidecar terminated with code: {:?}, signal: {:?}",
                                    terminated.code, terminated.signal
                                );
                                app.handle().exit(6);
                            }
                            _ => {
                                println!("unhandled CommandEvent has occurred");
                                app.handle().exit(7);
                            }
                        },
                        None => {
                            println!("channel was closed unexpectedly");
                            app.handle().exit(3);
                        }
                    }
                },
                Err(e) => {
                    println!("spawn err: {}", e);
                    app.handle().exit(2);
                }
            }
        }
        Err(e) => {
            println!("sidecar err: {}", e);
            app.handle().exit(1);
        }
    }
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            start_server(app);
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error running the application.")
}
