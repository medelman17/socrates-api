# Socrates Microservice

Socrates is a thin wrapper around an early-stage [AllenNLP](https://allennlp.org/) model that enables machine reading comprehension (MRC) for long-form, unstructured legal text. In other words, given a passage of text and a list of questions related thereto, Socrates will attempt to answer the questions, using the provided text as the source of truth.

As we did with [Blackstone](https://github.com/medelman17/blackstone-api), here, we wrap Socrates with a performant API layer written in Go. Communication between Socrates and the API layer happens via gRPC. And all of the above has been containerized to facilitate deploying "Socrates as a Microservice".

## Get Started

You must have Docker installed on your machine and access to the internet. Assuming the above, simply run:

`docker-compose up -d`

Running the above command starts the underlying Socrates service as well as the API layer,
which, by default, is accessible at http://localhost:8080. Note, however, as explained below,
the API layer currently does not support any GET requests. So, navigating to the address above
will return a `404-Not Found` error. No worries--check out Postman (https://www.postman.com/)
for easy programmatic access.

## Routes

The api currently exposes a single route--**/mrc**--which accepts a POST request with a JSON body that includes a "passage" property (type string) and a "questions" property (type []string). E.g.,

```json
{
  "passage": "...the text you want to query",
  "questions": ["...your first question?", "...your second question?"]
}
```

If all goes well, the above route will return a JSON body in the following shape:

```json
{
  "answers": [
    {
      "question": "...your first question...",
      "answer": "...Socrates answer to your first question..."
    }
  ]
}
```
