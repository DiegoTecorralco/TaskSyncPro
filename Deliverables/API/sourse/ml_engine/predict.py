import sys
import json
import joblib
import numpy as np
import os

# Cargar modelos al inicio (cache en RAM)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
model_sup = joblib.load(os.path.join(BASE_DIR, 'models/modelo_supervisado.pkl'))
model_unsup = joblib.load(os.path.join(BASE_DIR, 'models/modelo_no_supervisado.pkl'))
metadata = joblib.load(os.path.join(BASE_DIR, 'models/metadata.pkl'))

def main():
    # Recibir datos desde Node.js (argumentos o stdin)
    input_data = json.loads(sys.argv[1])
    
    # Preparar array de características (features)
    features = np.array([[
        input_data['total_tareas'],
        input_data['tareas_completadas'],
        input_data['antiguedad_dias']
    ]])
    
    # Ejecutar modelos
    pred_sup = model_sup.predict(features)[0]  # Horas estimadas
    cluster_unsup = int(model_unsup.predict(features)[0])  # Grupo del usuario
    
    # Formatear respuesta
    response = {
        "supervisado": {
            "prediccion": round(float(pred_sup), 2),
            "unidad": "horas_para_completar",
            "modelo": metadata['modelo_supervisado']
        },
        "no_supervisado": {
            "cluster": cluster_unsup,
            "segmento": f"Usuario Tipo {cluster_unsup + 1}",
            "modelo": metadata['modelo_no_supervisado']
        }
    }
    print(json.dumps(response))

if __name__ == "__main__":
    main()