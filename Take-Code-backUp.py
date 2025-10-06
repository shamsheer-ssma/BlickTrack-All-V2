import os
import shutil
import fnmatch
from datetime import datetime
from pathlib import Path
import json

# ====================== CONFIG ======================
SOURCE_DIRS = [
    r"C:\GIT\BlickTrack\backend-fresh",
    r"C:\GIT\BlickTrack\docs",
    r"C:\GIT\BlickTrack\qk-test-fresh"
]

OUTPUT_BASE_DIR = r"C:\code-backup\GIT-BT-Oct10"

# Files/folders to ignore
IGNORE_LIST = [
    "node_modules",
    ".next",
    ".git",
    ".gitignore",
    "dist",
    "build",
    ".nuxt",
    ".output",
    ".vscode",
    ".idea",
    "*.log",
    "coverage",
    ".nyc_output",
    "*.tmp",
    "*.temp",
    "Thumbs.db",
    ".DS_Store"
]

# ====================== FUNCTIONS ======================
def should_ignore(path):
    for pattern in IGNORE_LIST:
        if fnmatch.fnmatch(os.path.basename(path), pattern):
            return True
    return False

def copy_recursive(src_dir, dest_dir):
    files_copied = 0
    dirs_copied = 0
    for root, dirs, files in os.walk(src_dir):
        dirs[:] = [d for d in dirs if not should_ignore(d)]
        rel_path = os.path.relpath(root, src_dir)
        dest_path = os.path.join(dest_dir, rel_path)
        os.makedirs(dest_path, exist_ok=True)
        dirs_copied += len(dirs)
        for file in files:
            if should_ignore(file):
                continue
            src_file = os.path.join(root, file)
            dest_file = os.path.join(dest_path, file)
            shutil.copy2(src_file, dest_file)
            files_copied += 1
    return files_copied, dirs_copied

# ====================== MAIN ======================
def main():
    # Create timestamped output folder
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    output_dir = Path(OUTPUT_BASE_DIR) / f"Backup_{timestamp}"
    output_dir.mkdir(parents=True, exist_ok=True)
    print(f"Backup folder created: {output_dir}")

    total_files = 0
    total_dirs = 0

    for src_dir in SOURCE_DIRS:
        if not os.path.exists(src_dir):
            print(f"Source directory does not exist: {src_dir}")
            continue
        dest_subfolder = output_dir / Path(src_dir).name
        dest_subfolder.mkdir(exist_ok=True)
        files_copied, dirs_copied = copy_recursive(src_dir, dest_subfolder)
        total_files += files_copied
        total_dirs += dirs_copied

    # Summary
    print("\n========== Backup Summary ==========")
    print(f"Total files copied: {total_files}")
    print(f"Total directories created: {total_dirs}")
    print(f"Backup completed successfully ✅")

if __name__ == "__main__":
    main()
