import pandas as pd
import mysql.connector
from sklearn.cluster import KMeans
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, silhouette_score
import joblib
import os
from dotenv import load_dotenv

# Cargar variables de entorno desde el archivo .env (que está en la raíz de sourse/)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# 1. CONEXIÓN A BD (Usando las variables del .env)
db_config = {
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'database': os.getenv('DB_NAME')
}

print("Iniciando ETL y Entrenamiento...")

try:
    conn = mysql.connector.connect(**db_config)
    print(" Conectado a MySQL exitosamente")
    
    # 2. EXTRACCIÓN (ETL)
    query = "SELECT * FROM vw_ml_data"
    df = pd.read_sql(query, conn)
    conn.close()

    # Limpieza (ETL) - Eliminar nulos
    df = df.dropna()
    
    if df.empty:
        print("No hay datos en la vista vw_ml_data. Asegúrate de tener usuarios y recordatorios en la BD.")
        exit()

    # 3. MODELO SUPERVISADO: Regresión (Predecir horas para completar tarea)
    X = df[['total_tareas', 'tareas_completadas', 'antiguedad_dias']]
    y = df['avg_horas_para_completar']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    modelo_supervisado = RandomForestRegressor(n_estimators=100, random_state=42)
    modelo_supervisado.fit(X_train, y_train)

    # Evaluación
    predicciones = modelo_supervisado.predict(X_test)
    mse = mean_squared_error(y_test, predicciones)
    print(f" Modelo Supervisado (Random Forest) MSE: {mse:.2f}")
    
    # Definir la carpeta donde se guardarán los modelos (siempre dentro de ml_engine/models)
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    MODELS_DIR = os.path.join(BASE_DIR, 'models')

    # Crear la carpeta 'models' si no existe
    os.makedirs(MODELS_DIR, exist_ok=True)

    # Guardar los modelos con la ruta absoluta
    joblib.dump(modelo_supervisado, os.path.join(MODELS_DIR, 'modelo_supervisado.pkl'))

    # 4. MODELO NO SUPERVISADO: Clustering (Segmentación de usuarios)
    X_cluster = df[['total_tareas', 'tareas_completadas', 'antiguedad_dias']]
    kmeans = KMeans(n_clusters=3, random_state=42, n_init=10)
    kmeans.fit(X_cluster)

    # Evaluación
    sil_score = silhouette_score(X_cluster, kmeans.labels_)
    print(f" Modelo No Supervisado (K-Means) Silhouette Score: {sil_score:.2f}")
    joblib.dump(kmeans, os.path.join(MODELS_DIR, 'modelo_no_supervisado.pkl'))

    # 5. Guardar metadatos
    metadata = {
        'features': ['total_tareas', 'tareas_completadas', 'antiguedad_dias'],
        'modelo_supervisado': 'RandomForestRegressor',
        'modelo_no_supervisado': 'KMeans'
    }
    joblib.dump(metadata, os.path.join(MODELS_DIR, 'metadata.pkl'))

    print(f"Modelos guardados exitosamente en: {MODELS_DIR}")

except mysql.connector.Error as err:
    print(f" Error de conexión a MySQL: {err}")
    print("Verifica que MySQL esté corriendo en el puerto 3307 y que las credenciales sean correctas.")
except Exception as e:
    print(f"Error inesperado: {e}")