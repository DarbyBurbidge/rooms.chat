import json
import os
json_str = []
in_routes = False
with open('./frontend/src/main.tsx', 'r') as f:
    for line in f.readlines():
        if("createBrowserRo" in line):
            in_routes = True
        if(in_routes and ");" in line):
            in_routes = False
        if in_routes and "path:" in line:
            json_str.append(line.split("path:")[-1].strip())
for r in json_str:
    
    print(f"## Route {r.replace("'", "").replace(",", "")}")