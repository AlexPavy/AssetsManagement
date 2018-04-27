# Assets Management
Assets management API

Manage users, asset types, assets, and allocations.
- Asset types are a generic declaration of attributes with types that can be implemented by assets.
Later, asset types could declare more validation rules.
- Asset are generic objects that are typed by an asset type
- Allocations associate 1 asset with 1 user for a period of time.
1 user cannot have multiple allocations at the same time.
1 asset cannot have multiple allocations at the same time.

## Routes

### /<endpoint>
We have common routes for all objetcs
<common> can be replaced users, assettypes, assets, allocations

#### POST /<endpoint>
Create an object.
Example body for a user
```json
{
	"a1": "v1",
	"a2": 2
}
```

#### PATCH /<endpoint>:id
Update an object.
Example body for an update.
```json
{
	"a1": "v2"
}
```

#### DELETE /<endpoint>:id
Delete an object by id.

#### GET /<endpoint>:id
Get an object by id

#### GET /<endpoint>
Get all objects

### /users
Only common routes are available.
Example user:
```json
{
	"firstName": "Gomez",
	"lastName": "Addams",
	"email": "gomez.addams@family.com"
}
```

### /assettypes
Only common routes are available
Example asset type:
```json
{
	"name": "With color and size",
	"attributeTypes": {
		"color": {
			"jstype": "" // string
		},
		"size": {
        	"jstype": 0 // number
        }
	}
}
```

### /assets
Only common routes are available, but assets have validated with the asset type
Example asset:
```json
{
	"AssetTypeId": "2",
	"assetAttributes": {
		"color": "blue",
		"size": 44
	}
}
```

### /allocations
Common routes are available
Example allocation:
```json
{
	"UserId": "1",
	"AssetId": "6",
	"startDate": "Thu Apr 24 2018 23:42:41 GMT+0100 (GMT Summer Time)",
	"endDate": "Thu Apr 28 2018 23:42:41 GMT+0100 (GMT Summer Time)"
}
```

#### GET /allocations
Has 3 optional query parameters that can be combined together
- UserId (integer) : allocations for this user
- AssetId (integer) : allocations for this asset
- current (boolean) : only current allocations

Example for UserId
```http request
/allocations?UserId=2
```
Example for current
```http request
/allocations?current=true
```

## Test

Integration tests
```bash
set NODE_ENV=test&& mocha ./test/integration --exit
```

## Sequelize commands

- sequelize model:create --name User --attributes firstName:string
- sequelize db:migrate --config config/database.test.json