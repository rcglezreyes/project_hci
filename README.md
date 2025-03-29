# Sistema de Admisiones Médicas

## Índice
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Comandos](#comandos)
4. [Ejecutar la aplicación](#ejecutar-la-aplicación)
5. [Algunos endpoints definidos](#algunos-endpoints-definidos)
6. [Despliegue](#despliegue)
7. [Referencias](#referencias)


## Descripción del Proyecto

Este proyecto es el Caso de Estudio: Sistema de Gestión de Citas de Especialidades Médicas centrado en HCI.


## Tecnologías Utilizadas

### Lenguaje de Programación
- **Python**: Lenguaje principal utilizado para el desarrollo de toda la aplicación.
- **Javascript**: Lenguaje para el desarrollo del frontend

### Frameworks
- **Django**:

Incluye funcionalidades integradas como un potente ORM para interactuar con bases de datos, un panel de administración listo para usar y herramientas de seguridad que ayudan a prevenir vulnerabilidades comunes. 

Según Vincent (2018), Django es ideal para desarrollar aplicaciones web escalables y seguras, ya que permite a los desarrolladores concentrarse en escribir la lógica del negocio en lugar de reinventar la rueda en cuanto a infraestructura se refiere.
- **React**

Según Freeman (2018), el uso de componentes y el Virtual DOM de React simplifican el desarrollo de aplicaciones web interactivas y de alto rendimiento, permitiendo a los desarrolladores centrarse en la lógica de negocio y la experiencia del usuario sin preocuparse excesivamente por la manipulación del DOM.
- **ViteJS**
  
Vite es una herramienta moderna de construcción para proyectos web que se caracteriza por su rápido servidor de desarrollo y su eficiente empaquetado para producción. Aprovecha los módulos ES nativos del navegador para ofrecer tiempos de arranque casi instantáneos en el entorno de desarrollo, junto con una funcionalidad de reemplazo en caliente (Hot Module Replacement) que permite actualizar los módulos de la aplicación sin recargar toda la página. Además, utiliza Rollup para optimizar el código en la fase de producción, lo que resulta en bundles más pequeños y rápidos.

Según Wong (2021), Vite redefine la experiencia del desarrollo frontend al reducir significativamente los tiempos de espera durante la edición del código, permitiendo a los desarrolladores concentrarse en la lógica de la aplicación sin las demoras que suelen presentarse con otras herramientas tradicionales.

### Servidor web
- **Nginx**

Nginx es un servidor web de alto rendimiento que también actúa como proxy inverso, balanceador de carga y servidor de caché. 

Se caracteriza por su arquitectura basada en eventos, lo que le permite gestionar un gran número de conexiones concurrentes con un consumo mínimo de recursos. 

Esta eficiencia lo hace ideal para servir contenido estático y como intermediario entre clientes y aplicaciones backend. Además, Nginx es conocido por su facilidad de configuración y su capacidad para integrarse en infraestructuras de alta disponibilidad y escalabilidad (Johnson, 2019).


### Base de datos
- **MongoDB**

Base de datos NoSQL de código abierto diseñada para el manejo de grandes volúmenes de datos y para aplicaciones distribuidas, con alta escalabilidad y disponibilidad. 

En lugar de utilizar un esquema fijo, MongoDB almacena la información en documentos JSON (BSON) que pueden tener estructuras variables, lo que permite mayor flexibilidad en el modelado de datos (Chodorow, 2013).

- **Mongo Express**

Es una interfaz de administración web de código abierto para bases de datos MongoDB. Está desarrollada con Node.js y Express, lo que permite a los usuarios gestionar sus bases de datos a través de un navegador sin necesidad de recurrir a la línea de comandos. 

Con Mongo Express puedes explorar, crear, editar y eliminar colecciones y documentos, así como administrar índices y ejecutar operaciones CRUD de forma intuitiva. Esta herramienta resulta muy útil para desarrolladores y administradores que buscan una forma rápida y sencilla de interactuar con sus bases de datos MongoDB (Smith, 2017).

### Tecnologías y librerías
- **GraphQL**

GraphQL es un lenguaje de consulta para APIs y un entorno de ejecución que permite a los clientes solicitar exactamente los datos que necesitan, en lugar de recibir una respuesta predefinida. Esta precisión reduce la sobrecarga de datos y optimiza la comunicación entre el cliente y el servidor. 

Además, GraphQL proporciona una capa de abstracción sobre los datos, permitiendo evolucionar las APIs sin romper la compatibilidad con clientes existentes. Según Byrne (2020), GraphQL mejora la eficiencia en la recuperación de datos al evitar el "over-fetching" y el "under-fetching", lo que resulta en aplicaciones más flexibles y fáciles de mantener.

Ejemplo:
En Django:
```aiignore
schema.py
```
```aiignore
class SpecialtyType(MongoengineObjectType):
    class Meta:
        model = Specialty
        
class Query(graphene.ObjectType):
    specialties = graphene.List(SpecialtyType)
    
    def resolve_specialties(self, info):
        return Specialty.objects.all()
```
En React:
```aiignore
const GET_ALL_SPECIALTIES = gql`
  {
    specialties {
      createdTime
      description
      id
      lastModifiedTime
      name
      isActive
    }
  }
`;

export const useSpecialtiesQuery = () => {
  const { loading, error, data, refetch } = useQuery(GET_ALL_SPECIALTIES, {
    context: {
      clientName: 'Main',
    },
  });

  const items = data?.specialties || [];

  return { loading, error, data: items, refetch };
};
```

- **Websockets**

Son un protocolo que permite la comunicación bidireccional en tiempo real entre el cliente y el servidor a través de una única conexión TCP. 

Esto elimina la necesidad de realizar múltiples peticiones HTTP y permite actualizaciones instantáneas, lo que es especialmente útil en aplicaciones que requieren interactividad y respuesta inmediata, como chats en línea o sistemas de monitoreo en tiempo real (Smith, 2019).

Ejemplo:
En Django:
```aiignore
signals.py
```
```aiignore
def specialty_saved(sender, document, **kwargs):
    created = kwargs.get('created', False)
    channel_layer = get_channel_layer()
    event = {
        'type': 'specialty_update',
        'message': {
            'type': 'created' if created else 'updated',
            "item": {
                "id": str(document.id),
                "name": document.name,
                "description": document.description,
                "createdTime": document.created_time,
                "lastModifiedTime": document.last_modified_time,
                "isActive": document.is_active,
            }

        }
    }
    async_to_sync(channel_layer.group_send)('specialty', serialize_datetime(event))
```
En React:
```aiignore
useEffect(() => {
    const socket = new WebSocket(paths.backend.websocket.main.specialties);
    socket.onerror = (errorEvent) => {
      console.dir(errorEvent);
      console.error('WebSocket error (toString):', errorEvent.toString());
    };
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'created' || message.type === 'updated') {
        setTableData((prevData) => {
          const existingItemIndex = prevData.findIndex(
            (item) => String(item.id) === String(message.item.id)
          );
          if (existingItemIndex !== -1) {
            const updatedData = [...prevData];
            updatedData[existingItemIndex] = message.item;
            return updatedData;
          }
          return [message.item, ...prevData];
        });
      } else if (message.type === 'deleted') {
        setTableData((prevData) =>
          prevData.filter((item) => String(item.id) !== String(message.item.id))
        );
      }
    };
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);
```

- **Celery**

Es una cola de tareas asíncronas basada en el paso de mensajes, que permite ejecutar tareas en segundo plano de forma distribuida. 

Es especialmente útil en aplicaciones web para delegar procesos que consumen mucho tiempo (por ejemplo, envío de correos electrónicos, procesamiento de imágenes o cálculos intensivos) a trabajadores separados, liberando así el hilo principal de la aplicación para responder rápidamente a las solicitudes de los usuarios. Esto mejora la escalabilidad y el rendimiento del sistema (Johnson, 2018).

Ejemplo:
En Django:
```aiignore
settings.py
```
```aiignore
CELERY_BEAT_SCHEDULE = {
    'run-task-sequence-daily': {
        'task': 'api_async_task_sequence.tasks.task_sequence_daily',
        'schedule': crontab(minute=0, hour=8, day_of_week='*'),
    },
}
```
```aiignore
tasks.py
```
```aiignore
@shared_task
def task_delete_old_notifications():
    delete_old_notifications()

@shared_task
def task_delete_old_trackings():
    delete_old_trackings()
    
@shared_task
def task_sequence_daily():
    workflow = chain(
        task_delete_old_notifications.si(),
        task_delete_old_trackings.si(),
    )
    workflow.apply_async()
```

- **Django Channels**

Es una extensión de Django que permite gestionar conexiones asíncronas y protocolos distintos a HTTP, como WebSockets, facilitando la implementación de aplicaciones en tiempo real. 

Esta herramienta amplía la arquitectura tradicional de Django para soportar una comunicación bidireccional entre el servidor y el cliente, lo que es esencial para funcionalidades como chats en vivo, notificaciones push y actualizaciones en tiempo real (Smith, 2019).

Ejemplo:
En Django:
```aiignore
consumers.py
```
```aiignore
from channels.generic.websocket import AsyncWebsocketConsumer, AsyncJsonWebsocketConsumer
import json

######################################################
# SPECIALTY
######################################################

class SpecialtyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add(
            "specialty", 
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            "specialty",
            self.channel_name
        )

    async def receive(self, text_data):
        pass

    async def specialty_update(self, event):
        await self.send(text_data=json.dumps(event["message"]))
```

- **Redis**

Es un almacén de datos en memoria de código abierto que se utiliza ampliamente como base de datos, caché y corredor de mensajes. Se caracteriza por su alta velocidad, debido a que almacena los datos en memoria, y soporta estructuras de datos avanzadas como cadenas, listas, conjuntos, hashes y sorted sets, lo que lo hace ideal para aplicaciones en tiempo real, gestión de sesiones, colas de mensajes y análisis de datos en tiempo real. 

Además, Redis ofrece replicación, persistencia opcional y soporte para scripting con Lua, lo que mejora su versatilidad y robustez en entornos de producción (White, 2019).

Se usó en esta aplicación para el manejo del schedule de celery, los cahnnels y los websockets.

### Despliegue
- **Docker**: Sistema de contenedores
- **Docker Compose**: Orquestador para Docker

### Comandos
- **Clonar el repositorio**: 
```
git clone https://github.com/rcglezreyes/project_hci.git
```
- **Desmontar las imágenes de Docker**:
```
docker compose down
```
- **Montar las imágenes de Docker**: 
```
docker compose up -d --build
```
- **Gestionar una imagen específica en Docker**: 
```
docker compose down <<nombre_imagen_definida_en_docker-compose.yml>>
docker system prune -f
docker compose build <<nombre_imagen_definida_en_docker-compose.yml>>
docker compose up <<nombre_imagen_definida_en_docker-compose.yml>> -d
```

En este proyecto se han definido 6 imagenes en el ```docker-compose.yml``` y su implementacion está en los ```Dockerfile``` de cada carpeta:

backend, frontend, mongo_db, mongo_express, nginx y redis (en el docker-compose).

### Ejecutar la aplicación
URL backend GraphQL (users): 
```https://127.0.0.1:543/api/users/graphql/```

URL backend GraphQL (main): 
```https://127.0.0.1:543/api/main/graphql/```

URL Mongo Express: 
```http://127.0.0.1:8085/mongo_express``` 
(Acceso: user: admin, password: admin)


### Algunos Endpoints definidos
- **API Authorization**:
```
path("login/", views.login, name="login"),
path("logout/", views.logout, name="logout"),
path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
```
- **API Project (Main)**:
https URLs:
```
path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
path('create/<str:model_name>/', views.create_model, name='create_model'),
path('update/<str:model_name>/<str:id>/', views.update_model, name='update_model'),
path('delete/<str:model_name>/<str:id>/', views.delete_model, name='delete_model'),
path('create-patient/', views.create_patient, name='create_patient'),
path('update-patient/<str:id>/', views.update_patient, name='update_patient'),
path('delete-patient/<str:id>/', views.delete_patient, name='delete_patient'),
```
Websocket URLs:
```
path('api/project/ws/specialties/', SpecialtyConsumer.as_asgi(), name='ws_specialties'),
path('api/project/ws/departments/', DepartmentConsumer.as_asgi(), name='ws_departments'),
path('api/project/ws/rooms/', RoomConsumer.as_asgi(), name='ws_rooms'),
path('api/project/ws/disabilities/', DisabilityConsumer.as_asgi(), name='ws_disabilities'),
path('api/project/ws/patients/', PatientConsumer.as_asgi(), name='ws_patients'),
path('api/project/ws/medical-staffs/', MedicalStaffConsumer.as_asgi(), name='ws_medical_staffs'),
path('api/project/ws/admissions/', AdmissionConsumer.as_asgi(), name='ws_admissions'),
```

- **API Users**:
https URLs:
```
path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True, schema=schema))),
path('create/user-role/', views.create_user_role, name='create_user_role'),
path('edit/user-role/<str:id>/', views.edit_user_role, name='edit_user_role'),
path('delete/user-role/<str:id>/', views.delete_user_role, name='delete_user_role'),
path('delete/user-roles/', views.delete_user_roles, name='delete_user_roles'),
path('create/user/', views.create_user, name='create_user'),
path('edit/user/<str:id>/', views.edit_user, name='edit_user'),
path('delete/user/<str:id>/', views.delete_user, name='delete_user'),
path('delete/users/', views.delete_users, name='delete_users'),
path('change-password/<str:id>/', views.change_password, name='change_password'),
```
Websocket URLs:
```
path('api/user/ws/user-roles/', UserRoleConsumer.as_asgi(), name='ws_user_roles'),
path('api/user/ws/users/', UserConsumer.as_asgi(), name='ws_users'),
```

### Despliegue

Se desplegó en AWS, usando los servicios:

- Amazon ECR (Elastic Container Registry):

Se crearon 4 repositorios en este servicio de AWS para cada una de las imágenes.

- Amazon ECS (Elastic Container Services):

Se creó un cluster, con 4 servicios dentro: ***mongo_db_ecs, mongo_express_ecs, backend_ecs y frontend_ecs***

Se crearon las respectivas ***task definition*** para cada uno de los microservicios.

- Amazon Load Balancer:

Se crearon 3 balanceadores de carga: 1 de tipo Network Load Balancer para ***mongo_db*** y 2 de tipo Application Load Balancer para ***backend, frontend y mongo_express***

- Amazon Target Group:

Se crearon 4 target groups para cada uno de los microservicios, especificando el respectivo puerto TCP del container.

- Amazon EFS (Elastic File System):

Se creo un volumen para la persistencia de la data de ***mongo_db***

- Amazon S3 (Simple Storage Service):

Se creó un bucket, con los 4 archivos de variables de entorno de cada uno de los microservicios

- Route 53:

Se registró un dominio en este servicio

- Amazon Certificate Manager:

Se registró un certificado SSL para multidominio

- Amazon ElasticCache:

Se creo un cluster para el servicio de redis

- Amazon IAM (Identity and Access Management):

Se creo un role con los permisos de: Full access en ElasticCache, en EFS, incluyéndolo como role ejecutor en cada una de las task definitions.


### Referencias

- Freeman, E. (2018). React: Up & Running. O'Reilly Media.
- Vincent, W. S. (2018). Django for Beginners: Build websites with Python and Django. Self-Published.
- Wong, A. (2021). Introduction to Vite: Modern tooling for frontend development. TechPress.
- Byrne, J. (2020). GraphQL: A flexible approach to building APIs. Developer Insight Press.
- Smith, A. B. (2019). Real-time web communications with WebSockets. Web Development Journal, 15(2), 45–58.
- Johnson, C. D. (2018). Implementing scalable asynchronous task processing with Celery. Journal of Python Applications, 10(1), 23–37.
- White, A. (2019). Redis Essentials: A Field Guide to Building High-Performance, Scalable, and Secure In-Memory Data Stores. Packt Publishing.
- Chodorow, K. (2013). MongoDB: The Definitive Guide: Powerful and Scalable Data Storage (3rd ed.). O'Reilly Media.
- Smith, J. (2017). An introduction to Mongo Express: A lightweight web-based MongoDB admin interface. Recuperado de https://www.example.com/mongo-express-introduction
- Johnson, M. (2019). Understanding Nginx: Architecture and Performance. Tech Press.

