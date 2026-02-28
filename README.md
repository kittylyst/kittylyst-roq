# kittylyst-roq

This project is my personal website, built using Roq and uses Quarkus and Roq.

If you want to learn more about Quarkus, please visit its website: <https://quarkus.io/>.

## Running the application in dev mode

You can run your application in dev mode that enables live coding using:

```shell script
./mvnw quarkus:dev
quarkus dev
```

> **_NOTE:_**  Quarkus now ships with a Dev UI, which is available in dev mode only at <http://localhost:8080/q/dev/>.

## Packaging and running the application

The website can be packaged using:

```shell script
quarkus build -Dquarkus.roq.generator.batch
quarkus run
```

## Related Guides

- Roq ([guide](https://iamroq.com/docs/)): Roq — a small SSG (Static Site Generator) built on Quarkus.

## Provided Code
