# Sistema de Admisiones Médicas

## Índice
1. [Descripción del Proyecto](#descripción-del-proyecto)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Comandos](#comandos)
4. [Ejecutar la aplicación](#ejecutar-la-aplicación)
5. [Endpoints definidos](#endpoints-definidos)


## Descripción del Proyecto

Este proyecto es el Caso de Estudio: Sistema de Gestión de Citas de Especialidades Médicas centrado en HCI.


## Tecnologías Utilizadas

### Lenguaje de Programación
- **Python**: Lenguaje principal utilizado para el desarrollo de toda la aplicación.
- **Javascript**: Lenguaje para el desarrollo del frontend

### Frameworks
- **Django**
- **ViteJS**
- **React**

### Tecnologías y librerías
- **GraphQL**
- **Websockets**

### Despliegue
- **Docker**: Sistema de contenedores
- **Docker Compose**: Orquestador para Docker

### Comandos
- **Clonar el repositorio**: 
```
git clone https://github.com/rcglezreyes/project_hci.git
```
- **Montar las imágenes de Docker**: 
```
docker compose up -d --build
```

- **Gestionar una imagen específica en Docker**: 
```
docker compose down <<nombre_imagen_definida_en_docker-compose.yml>>
docker compose build <<nombre_imagen_definida_en_docker-compose.yml>>
docker compose up <<nombre_imagen_definida_en_docker-compose.yml>> -d
```

### Ejecutar la aplicación
URL backend GraphQL (users): ```https://127.0.0.1:543/api/users/graphql/```
URL backend GraphQL (main): ```https://127.0.0.1:543/api/main/graphql/```
URL Mongo Express: ```http://127.0.0.1:8085/mongo_express``` (Acceso: user: admin, password: admin)

Mostrar una consulta GraphQL desde GraphIQL de Python-Django:
- Acceder a la primera URL definida anteriormente
- Ejecutar la consulta:
```
query {
  allLoginUsers {
    address
    avatarUrl
    createdTime
    email
    firstName
    gender
    id
    lastLogin
    lastModifiedTime
    lastName
    phoneNumber
    token
    userRole
    username
  }
}
```

### Endpoints definidos
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
