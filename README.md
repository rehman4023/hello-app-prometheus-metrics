# How To setup Prometheus Monitoring for a simple microservice

Prometheus is an open-source systems monitoring and alerting toolkit originally built at SoundCloud. It is 100% open source software. Many companies and organizations have adopted Prometheus, and the project has a very active developer and user community. It is now a standalone open source project and maintained independently of any company. To emphasize this, and to clarify the project's governance structure, Prometheus joined the Cloud Native Computing Foundation in 2016 as the second hosted project, after Kubernetes.

This application is built with nodejs and we are using "express-prometheus-middleware" module to get metrics into a defined path like /metrics.



## Cloning the Repository

```
git clone https://github.com/sangam14/Prometheus-Monitoring-with-k8
```

# Create A Docker image

```docker build node-prom-metrics .```
this will build docker image and store it in local repo, tag the image by running following command 

```docker tag node-prom-metrics gcr.io/projectid/reponame:version```

# Pushing the docker image into gcr.io

after taging the image ina proper manner with proper permission we are now ready to upload to gcr.io with docker push command

```docker push gcr.io/projectid/reponame:version```

# Create a deployment on default namespace namespace using the following file.

````````
apiVersion: apps/v1

kind: Deployment

metadata:

  name: hello-app-node

  labels:

    app: hello-app-node

spec:

  replicas: 1

  selector:

    matchLabels:

      app: hello-app-node

  template:

    metadata:

      labels:

        app: hello-app-node

    spec:

      containers:

      - name: prometheus-test-helloworld

        image: gcr.io/projectid/reponame:version

        ports:

        - containerPort: 9091

````````

```kubectl create  -f hello-app-deployment.yaml```

# create a service for the above deployment using the following file.

``````
apiVersion: v1
kind: Service
metadata:
  name: hello-app-service
  
spec:
  selector: 
    app: hello-app-node  
  ports:
    - protocol: TCP
      port: 8081
      targetPort: 9091

``````

```kubectl create  -f hello-app-svc.yaml```


# after creating the svc add the job to config map for Prometheus

`````
      - job_name: 'prom_middleware'
        static_configs:
          - targets: ['hello-app-service.default.svc.cluster.local:8081']
`````

restart the deployment and this should start scraping metrics from your Prometheus
