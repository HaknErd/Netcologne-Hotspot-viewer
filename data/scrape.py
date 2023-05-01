import json
import requests


url = 'https://netcologne-unternehmen.de/wp-admin/admin-ajax.php'
payload = {
    'action': 'mmp_map_markers',
    'type': 'map',
    'id':"" ,
    'custom': 'undefined',
    'lang': ''
}

response = requests.post(url, data=payload)
def process(data):
    # extract the required fields from each feature
    features = data['data']['features']
    result = []
    for feature in features:
        coordinates = feature['geometry']['coordinates'][::-1]
        name = feature['properties']['name']
        result.append({'coordinates': coordinates, 'name': name})

    # write the result to a new file in JSON format
    with open('/data/data.json', 'w') as f:
        json.dump(result, f)

if response.ok:
    data = dict(response.json())
    # Process the JSON response data as needed
    process(data=data)
    
else:
    print(f'Request failed with status code {response.status_code}')
