import json
import os
json_str = []
imports = []
in_routes = False
with open('./frontend/src/main.tsx', 'r') as f:
    for line in f.readlines():
        if("createBrowserRo" in line):
            in_routes = True
        if(in_routes and ");" in line):
            in_routes = False
        if in_routes and "path:" in line:
            json_str.append(line.split("path:")[-1].strip())
        if("import" in line and (".tsx" in line or ".jsx" in line)):
            imports.append(line.split("import ")[-1])
for r in json_str:
    
    print(f"## Route {r.replace("'", "").replace(",", "")}")
for i in imports:
    link = i.split("from")[-1].strip()[:-2].strip("\"").replace("'", "").replace("./","")
    name = i.split("from")[0].strip()
    print(f"## {name} in [{link}](src/{link})")