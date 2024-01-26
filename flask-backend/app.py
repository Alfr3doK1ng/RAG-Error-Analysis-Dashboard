from flask import Flask, request, jsonify
from openai import OpenAI
from sklearn.manifold import TSNE
import pandas as pd
import os

OpenAI_api_key = "your-openai-api-key" # Fill in your api-key

os.environ["OPENAI_API_KEY"] = OpenAI_api_key


client = OpenAI(api_key=OpenAI_api_key)
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/get-embeddings', methods=['POST'])
def get_embeddings():
    try:
        data = request.json['parsedData']
        n = len(data)
        query = [data[i]['query'] for i in range(n)]
        response = client.embeddings.create(input = query, model = "text-embedding-3-small")
        # Extracting the actual embeddings from the response
        query_embeddings = [embedding.embedding for embedding in response.data]
        query_df = pd.DataFrame(query_embeddings)
        tsne = TSNE(n_components=2, perplexity=15, random_state=42, init='random', learning_rate=200)
        query_2d = tsne.fit_transform(query_df).tolist()

        answer = [data[i]['labelandllmgeneratedresponse'] for i in range(n)]
        response = client.embeddings.create(input = answer, model = "text-embedding-3-small")
        # Extracting the actual embeddings from the response
        answer_embeddings = [embedding.embedding for embedding in response.data]
        answer_df = pd.DataFrame(answer_embeddings)
        tsne = TSNE(n_components=2, perplexity=15, random_state=42, init='random', learning_rate=200)
        answer_2d = tsne.fit_transform(answer_df).tolist()

        
        return jsonify({'query_embeddings': query_embeddings, 'query_2d': query_2d, 'query' : query,
                         'answer_embeddings' : answer_embeddings, 'answer_2d' : answer_2d, 'answer' : answer})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080, debug=True)
