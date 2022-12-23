CREATE TABLE api_catalog_t
(
    api_id varchar(200),
    api_name varchar(50) NOT NULL,
    api_version varchar(50) NOT NULL,
    catalog_name varchar(50) NULL,
    api_security varchar(50) NULL,
    environment varchar(50) NOT NULL,
    api_org varchar(50) NOT NULL,
    api_state varchar(50) NOT NULL,
    create_date DATE NOT NULL,
    enabled BOOLEAN NOT NULL,
    PRIMARY KEY(api_id, api_version, environment )
);

  CREATE TABLE subscription_details
  (
      api varchar(200) NOT NULL,
      clientId varchar(50) NOT NULL,
      appName varchar(50) NOT NULL,
      environment varchar(50) NOT NULL,
      subscriptionPlan varchar(50) NULL,
      rateLimit int NOT NULL,
      rateLimitDurationInSeconds int NOT NULL,
      burstLimit int NOT NULL,
      burstLimitDurationInSeconds int NOT NULL,
      planDetails varchar NOT NULL,
  	  kongWorkSpace varchar NOT NULL,
  	  PRIMARY KEY(api, clientId, environment )
  );
