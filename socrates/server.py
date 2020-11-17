import logging
from concurrent.futures import ThreadPoolExecutor
from allennlp_models.pretrained import get_pretrained_models, get_tasks, load_predictor


import grpc

from socrates_pb2 import SocratesRequest, SocratesResponse
from socrates_pb2_grpc import SocratesServicer, add_SocratesServicer_to_server


class SocratesServer(SocratesServicer):
    def __init__(self):
        self.predictor = load_predictor('rc-bidaf')

    def Ask(self, request, context):

        answers = []
        for question in request.questions:
            result = self.predictor.predict(passage=request.passage, question=question)
            answers.append({"question": question, "answer": result["best_span_str"]})

        resp = SocratesResponse(answers=answers)
        return resp


if __name__ == '__main__':
    import argparse

    parser = argparse.ArgumentParser(
        description="Create a Socrates gRPC server")
    parser.add_argument("-p", "--port", type=int,
                        help="Port number that the server should run on", default=9999)
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
    )
    args = parser.parse_args()
    server = grpc.server(ThreadPoolExecutor())
    add_SocratesServicer_to_server(SocratesServer(), server)
    port = args.port
    server.add_insecure_port(f'[::]:{port}')
    server.start()
    logging.info('server ready on port %r', port)
    server.wait_for_termination()