# API management soluton with Kong OSS gateway

The purpose of this application is to build a lightweight API management solution with Kong OSS gateway, an REST based application to manage API deployment related operations (CRUD), API subscription related operation (CRUD) and a REACT based developer portal to show API Specification. 
The code base here covers the API Gateway installation and setup and nodejs application to manage API deployment and subscription.

<div align="center">
    <img src="arch1.png">
</div>


## GCP Set up
### Application Deployment and runtime
#### GCP Service Account Creation

* Create a service account for application deployment with below roles
    * Cloud Build Service Account 
    * Cloud Run Developer 
    * Service Account User 

* Create a service account for application runtime with below roles
    * Pub/Sub Publisher
    * Storage Object Admin
    * Secret Manager Secret Accessor 

####  Create a GCS Bucket

####  Create pubsub topic

#### Create a postgresSQL instance in cloud SQL

#### Create GCP Workload identity federation
 
📚 Read more : [GCP Workload Identity Federation for Github ](https://medium.com/google-cloud/how-does-the-gcp-workload-identity-federation-work-with-github-provider-a9397efd7158)

```
gcloud iam workload-identity-pools create "<POOL-NAME>" \
  --project="<PROJECT-ID>" \
  --location="global" \
  --display-name="<POOL-NAME>"
```

```
gcloud iam workload-identity-pools describe "<POOL-NAME>" \
  --project="<PROJECT-ID>" \
  --location="global" \
  --format="value(name)"
```

```
export WORKLOAD_IDENTITY_POOL_ID="projects/<PROJECT-ID>/locations/global/workloadIdentityPools/<POOL-NAME>"
```

```
gcloud iam workload-identity-pools providers create-oidc "<GCP-IDNETITY-PROVIDER-NAME>" \
  --project="<PROJECT-ID>" \
  --location="global" \
  --workload-identity-pool=<POOL-NAME>" \
  --display-name="<GCP-IDNETITY-PROVIDER-NAME>" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

```
gcloud iam service-accounts add-iam-policy-binding "SERVICE-ACCOUNT-PRINCIPAL" \
  --project="<PROJECT-ID>" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/Lagnashree/lightweight_api-management_kong-oss"
```

gcloud iam service-accounts add-iam-policy-binding "SERVICE-ACCOUNT-PRINCIPAL" \
  --project="devproject-372318" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/${WORKLOAD_IDENTITY_POOL_ID}/attribute.repository/Lagnashree/lightweight_api-management_kong-oss"


### GCP Secret Manager
Create a secret manager called "runtime-secret" with below JSON secret value, replace the values in JSON payload with right data.
```
{
"POSTGRES_HOST":"<POSTGRES_HOST>",
"POSTGRES_PORT":"<POSTGRES_PORT>",
"POSTGRES_USERNAME":"<POSTGRES_USERNAME>",
"POSTGRES_PASSWORD":"<POSTGRES_PASSWORD>",
"POSTGRES_DATABASE":"<POSTGRES_DATABASE>",
"BUCKET_NAME":"<BUCKET_NAME>",
"KONG_ADMIN_TOKEN":"<KONG_ADMIN_TOKEN>",
"KONG_ADMIN_URL":"<KONG_ADMIN_URL>",
"GIT_ACCESS_TOKEN": "<GIT_ACCESS_TOKEN>"
}
```

## GIT SETUP
### Create GIT Secret
  
Create below GIT secret for GIT Hub Action:

* SA_RUNTIME_EMAIL
* VPC_CONNECTOR
* PROJECT_ID


## Kong OSS Installation

Here I have chosen GCP VM to install the kong OSS version 3.0.x (Note this installation is not ready for production use but to set up a quick kong GW to demo)

### Step 1
In GCP console create a VM with below details
Allow TCP 8001 PORT in network firewall
    
### Step 2:
Logged into VM and ran below steps. It would install required dependency and download kong binaries and install the package

```
sudo apt update && sudo apt upgrade &&
sudo apt install curl &&
sudo apt install lsb-release && sudo apt install apt-transport-https &&
curl -Lo kong-enterprise-edition-3.0.1.0.all.deb "https://download.konghq.com/gateway-3.x-debian-$(lsb_release -cs)/pool/all/k/kong-enterprise-edition/kong-enterprise-edition_3.0.1.0_amd64.deb" &&
sudo dpkg -i kong-enterprise-edition-3.0.1.0.all.deb
``` 

### Step 3:
set up a postgres DB for kong Gateway and Provision a database and a user 

```
CREATE USER kong WITH PASSWORD 'super_secret'; CREATE DATABASE kong OWNER kong;
```
    
### Step 4
Setup config

```
sudo cp /etc/kong/kong.conf.default /etc/kong/kong.conf
```

open the /etc/kong/kong.conf and add below lines

```
sudo vi /etc/kong/kong.conf
pg_user = kong
pg_password = password you set
pg_database = kong
pg_host= pg host 
admin_listen = 0.0.0.0:8001
```

sudo kong migrations bootstrap -c /etc/kong/kong.conf
sudo kong start -c /etc/kong/kong.conf

