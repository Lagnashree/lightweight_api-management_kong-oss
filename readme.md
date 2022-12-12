# API management soluton with Kong OSS gateway

The purpose of this application is to build a lightweight API management solution with Kong OSS gateway, an REST based application to manage API deployment related operations (CRUD), API subscription related operation (CRUD) and a REACT based developer portal to show API Specification. 
The code base here covers the API Gateway installation and setup and nodejs application to manage API deployment and subscription.

<div align="center">
    <img src="arch1.png">
</div>

## Kong OSS Installation

Here I have chosen GCP VM to install the kong OSS version 3.0.x (Note this installation is not ready for production use but to set up an quick kong GW to demo)

### Step 1
In GCP console create a VM with below details
Allow TCP 8001 PORT in newtwork firewall
    
### Step 2:
Logged into VM and ran below steps. It would install required dependency and download kong binaries and install the package

```
sudo apt update && sudo apt upgrade &&
sudo apt install curl &&
sudo apt install lsb-release &&
curl -Lo kong-enterprise-edition-3.0.1.0.all.deb "https://download.konghq.com/gateway-3.x-debian-$(lsb_release -cs)/pool/all/k/kong-enterprise-edition/kong-enterprise-edition_3.0.1.0_amd64.deb" &&
sudo dpkg -i kong-enterprise-edition-3.0.1.0.all.deb
``` 

### Step 4:
set up a postgres DB for kong Gateway and Provision a database and a user 

```
CREATE USER kong WITH PASSWORD 'super_secret'; CREATE DATABASE kong OWNER kong;
```
    
### Step 3
Setup config

```
sudo cp /etc/kong/kong.conf.default /etc/kong/kong.conf
```

open the /etc/kong/kong.conf and add below lines