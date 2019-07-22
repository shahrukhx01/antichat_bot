from flask import Flask
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer


app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'
cors = CORS(app, resorces={r'/give_me_data': {"origins": '*'}})
api = Api(app)

parser = reqparse.RequestParser()
parser.add_argument('text', type=str)

class AntiChatBot:
    def __init__(self):
        self.chatbot = ChatBot('Ron Obvious')

    def trainBot(self):

        # Create a new trainer for the chatbot
        trainer = ChatterBotCorpusTrainer(self.chatbot)

        # Train the chatbot based on the english corpus
        trainer.train("chatterbot.corpus.english")

        # Train based on english greetings corpus
        trainer.train("chatterbot.corpus.english.greetings")

        # Train based on the english conversations corpus
        trainer.train("chatterbot.corpus.english.conversations")

    def getReply(self,text):
        print(str(self.chatbot.get_response(text)))
        return str(self.chatbot.get_response(text))

bot = AntiChatBot()
bot.trainBot()

#class HelloWorld(Resource):
#    def get(self):
#        bot.getReply('Hey! how are you?')
#        return {'hello': 'world'}

class getBotReply(Resource):
    def post(self):
        args = parser.parse_args()
        print (args)

        result = {'reply':bot.getReply(args['text'])}

        return result, 200

#api.add_resource(HelloWorld, '/')
api.add_resource(getBotReply, '/get_reply')

if __name__ == '__main__':
    app.run(debug=False)
