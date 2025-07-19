find src -type f \( -name "*.js" -o -name "*.ts" -o -name "*.jsx" \) ! -name "all_combined.js" | sort | xargs -I {} sh -c 'echo "// --- Begin: {} ---" >> src/all_combined.js; cat "{}" >> src/all_combined.js; echo "\n// --- End: {} ---\n" >> src/all_combined.js'


THIS BASH COMMAND HELPS COMBINE ALL CODE UNDER src into one single file so that debugging with LLM can be easier.