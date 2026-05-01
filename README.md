<div align="center">

<!-- <img src="https://img.shields.io/badge/-CLOUD%20%26%20EDGE%20COMPUTING%20PROJECT-0d9488?style=for-the-badge&labelColor=0f172a" /> -->

# 🏥 MediCore
### Distributed Hospital Management System

*A next-generation healthcare platform built on cloud-native microservices principles*

<br/>

[![Microservices](https://img.shields.io/badge/Architecture-Microservices-0d9488?style=flat-square)](https://microservices.io/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Nginx](https://img.shields.io/badge/Nginx-API_Gateway-009639?style=flat-square&logo=nginx&logoColor=white)](https://nginx.org/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

<br/>

| 5 Microservices | 3 User Roles | 100% Containerized | Fault Isolated |
|:-:|:-:|:-:|:-:|
| Independent services | Admin · Doctor · Receptionist  | Docker + Compose | Blast-radius contained |

</div>

---

## 📌 Overview

**MediCore** is a comprehensive, enterprise-grade Hospital Management System engineered from the ground up to demonstrate advanced **Cloud & Edge Computing (CEC)** concepts.

Unlike traditional monolithic applications, MediCore is architected as a highly distributed network of **independent microservices**. This design guarantees:
- ⚡ **Extreme fault tolerance** — one service fails, the rest keep running
- 📈 **Independent horizontal scaling** — scale only what's under load
- 🚀 **Isolated deployment cycles** — update billing without touching auth
- 🌐 **True portability** — runs identically on a laptop, edge node, or AWS cluster

> This architecture mirrors real-world cloud-native systems used by companies like Netflix, Amazon, and Google Health.

---

## ☁️ Cloud & Edge Computing Architecture

This project is a direct implementation of four foundational CEC design patterns:

### 1. 🔩 Microservices Architecture — Decoupling

Instead of a single massive server, MediCore is decomposed into **five specialized, autonomous services**, each owning its domain entirely and communicating via well-defined REST contracts.

> **CEC Benefit:** If the hospital experiences a surge in patient registrations, only `patient-service` scales horizontally across cloud instances — no wasted compute on `billing-service` or `doctor-service`.

---

### 2. 🐳 Docker Containerization & Isolation

Every service is encapsulated in its own **Docker container** — packaging the application code, Node.js runtime, libraries, and environment variables into a single standardized unit. The entire system is orchestrated via `docker-compose`.

> **CEC Benefit:** "It works on my machine" is eliminated. A container behaves identically on a developer's local machine, an **Edge computing node in a rural clinic**, or a massive **AWS cloud cluster**.

---

### 3. 🔀 API Gateway Pattern — Nginx Reverse Proxy

The frontend never communicates directly with individual microservices. All traffic flows through the **Nginx API Gateway**, which handles path-based routing, load balancing, and conceals the internal network topology.

| Route | Forwarded To |
|:---|:---|
| `/auth/*` | `auth-service:3001` |
| `/patients/*` | `patient-service:3002` |
| `/doctors/*` | `doctor-service:3003` |
| `/appointments/*` | `appointment-service:3004` |
| `/billing/*` | `billing-service:3005` |

> **CEC Benefit:** One secure public-facing entry point. Internal service topology is completely hidden from the internet.

---

### 4. 🛡️ Fault Tolerance & Resilience

Because the system is fully distributed, a failure in one domain is completely contained within its Docker container — no cascade failures across the system.

> **CEC Benefit:** If `billing-service` crashes due to a database overload, doctors can still log in, view appointments, and write digital prescriptions — **zero interruption to clinical operations**.
>
> **Try it yourself:** `docker-compose stop billing-service` → verify the rest of the app stays fully functional.

---

## 🗺️ System Topology

```
┌─────────────────────────────────────────┐
│           React Frontend SPA            │
│         localhost:3000                  │
└───────────────────┬─────────────────────┘
                    │  HTTP Requests
                    ▼
┌─────────────────────────────────────────┐
│         Nginx API Gateway               │
│    Reverse Proxy · Port 80              │
│  Request Routing + Load Balancing       │
└──┬────────┬────────┬────────┬───────┬───┘
   │        │        │        │       │
   ▼        ▼        ▼        ▼       ▼
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│ Auth │ │Patnt │ │ Doc  │ │ Appt │ │ Bill │
│:3001 │ │:3002 │ │:3003 │ │:3004 │ │:3005 │
└──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
   └────────┴────────┴────────┴─────────┘
                    │
                    ▼
       ┌────────────────────────┐
       │     MongoDB Atlas      │
       │  Cloud Database Cluster│
       └────────────────────────┘
```

---

## ✨ Key Features

- 🔐 **Role-Based Access Control (RBAC)** — Secure JWT-based routing. The UI dynamically renders based on whether the logged-in user is an **Admin**, **Doctor**, **Receptionist**, or **Billing Staff**.

- 📧 **Passwordless OTP Authentication** — Integrated NodeMailer for Email-based One Time Passwords, enabling modern passwordless login backed by time-limited tokens.

- ✉️ **Automated Doctor Onboarding** — When admins add a new doctor, the system automatically fires an encrypted invitation link to their email — zero-touch provisioning via the `auth-service`.

- 🩺 **Digital Consultations** — Dedicated clinical workspace for doctors to record patient vitals, diagnosis, and prescriptions in a structured digital format.

- 🖨️ **Smart Print Engine** — Natively formats consultation data into perfectly styled **A4 OPD sheets** for physical medical records — no third-party tool required.

- ⚡ **Independent Horizontal Scaling** — Any single container can be scaled in isolation. Patient surge? Scale only `patient-service`.

---

## 🚀 Getting Started

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — installed and running
- [Node.js](https://nodejs.org/) — for the React frontend

---

### Step 1 — Boot the Microservices

Navigate to the project root and launch the full Docker orchestration. This pulls base images, builds all service containers, and starts the internal network + API Gateway.

```bash
docker-compose up -d --build
```

> 💡 **Fault isolation demo:** Run `docker-compose stop billing-service` and verify the rest of the application remains fully operational — this is containerized fault isolation in action.

---

### Step 2 — Start the Frontend

Open a new terminal, navigate to the `frontend` folder, and start the React dev server:

```bash
cd frontend
npm install
npm start
```

The application will be accessible at **http://localhost:3000**

---

### Step 3 — Verify All Services Are Running

```bash
docker-compose ps
```

You should see all 5 microservices + the Nginx gateway with status `Up`.

---

## 📂 Service Directory

| Directory | Role | Key Technologies |
|:---|:---|:---|
| `/api-gateway` | Nginx Reverse Proxy | Nginx, Docker |
| `/auth-service` | Authentication & Authorization | JWT, NodeMailer, OTP, Node.js |
| `/patient-service` | Patient Profile Management | Node.js, Express, MongoDB |
| `/doctor-service` | Staff Directory & Scheduling | Node.js, Express, MongoDB |
| `/appointment-service` | Scheduling & Clinical Consultations | Node.js, Express, MongoDB |
| `/billing-service` | Invoice Generation & Tracking | Node.js, Express, MongoDB |
| `/frontend` | React Single Page Application | React, Axios |

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| Frontend | React (SPA) | Role-aware dynamic UI |
| API Gateway | Nginx | Routing, load balancing, security |
| Backend | Node.js + Express | RESTful microservice logic |
| Database | MongoDB Atlas | Shared cloud document store |
| Auth | JWT + OTP | Stateless auth + passwordless login |
| Email | NodeMailer | OTP delivery + doctor invitations |
| Containerization | Docker + Docker Compose | Service isolation + orchestration |

---

## 📖 CEC Concepts Demonstrated

| Concept | Implementation |
|:---|:---|
| Microservices Architecture | 5 independently deployable services |
| Containerization | Docker — one container per service |
| Service Orchestration | `docker-compose` manages the full network |
| API Gateway Pattern | Nginx reverse proxy with path-based routing |
| Fault Isolation | Container-level blast radius containment |
| Horizontal Scaling | Per-service `docker-compose scale` support |
| Edge Portability | Containers run identically on any host/environment |
| Stateless Authentication | JWT tokens — no server-side session state |

---

<div align="center">

**MediCore** — Cloud & Edge Computing Project

*Built with microservices, containerization, and cloud-native principles*

</div>
