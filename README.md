# Socrates Microservice

Socrates is a thin wrapper around an early-stage [AllenNLP](https://allennlp.org/) model that enables machine reading comprehension (MRC) for long-form, unstructured legal text. In other words, given a passage of text and a list of questions related thereto, Socrates will attempt to answer the questions, using the provided text as the source of truth.

As we did with [Blackstone](https://github.com/medelman17/blackstone-api), here, we wrap Socrates with a performant API layer written in Go. Communication between Socrates and the API layer happens via gRPC. And all of the above has been containerized to facilitate deploying "Socrates as a Microservice".
