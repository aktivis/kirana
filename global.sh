packager() {
  cd backend
  poetry env remove --all
  rm -rf .venv out
  poetry shell
  poetry install
  rm -rf kirana.sqlite kirana.duckdb
  touch kirana.sqlite kirana.duckdb
  pyinstaller --onefile server.py --name "kirana-server-aarch64-apple-darwin" --specpath out --workpath out/build --distpath out/dist --hidden-import=pyduckdb --hidden-import=pyduckdb.filesystem

  cd ../frontend
  rm -rf node_modules
  npm install
  
  cd ../desktop
  rm -rf target
  cargo tauri build

  cd ..
}

"$@"