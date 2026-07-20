# This Dockerfile must be used from within target/
FROM registry.access.redhat.com/ubi9/openjdk-25:latest AS build
USER root
ENV LANGUAGE='en_US:en'

RUN microdnf install procps-ng
WORKDIR /deployments
# We make four distinct layers so if there are application changes the library layers can be re-used
COPY --chown=185 quarkus-app/lib/ /deployments/lib/
COPY --chown=185 quarkus-app/*.jar /deployments
COPY --chown=185 quarkus-app/app/*.jar /deployments/app/
COPY --chown=185 quarkus-app/quarkus/ /deployments/quarkus/
#COPY quarkus-run.jar /content/quarkus-run.jar

EXPOSE 8080
USER 185
ENV JAVA_OPTS_APPEND="-Dquarkus.http.host=0.0.0.0 -Djava.util.logging.manager=org.jboss.logmanager.LogManager"
ENV JAVA_APP_JAR="/deployments/quarkus-run.jar"

CMD [ "/opt/jboss/container/java/run/run-java.sh" ]
