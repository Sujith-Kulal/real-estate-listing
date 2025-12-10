
# BHUMI – Real Estate Listing System

BHUMI is a web-based real estate listing platform designed to simplify buying, selling, and renting properties. The system enables property owners to list land, plots, and apartments with complete details, while buyers and tenants can search properties using filters. With integrated maps and dynamic nearby transport detection, BHUMI ensures transparency, accessibility, and efficiency.

---

## 1. General Introduction

In the current era of digitization, the real estate sector is transitioning from traditional, broker-dependent models to online, user-driven platforms. Conventional practices involve physical visits, high intermediary fees, and limited information access.

BHUMI – Real Estate Listing System addresses these issues by providing a centralized digital platform where:

* Sellers can list properties with images and detailed descriptions.
* Buyers can search properties based on filters.
* The system displays nearby transport and amenities within a 300m radius.

BHUMI ensures a seamless, transparent, and cost-effective experience for all users.

---

## 2. Objectives of the Project

The primary objective of BHUMI is to deliver a user-friendly and efficient digital platform for property management.

### Specific Objectives

1. Allow users to list properties with details such as price, area, location, property type, images, and amenities.
2. Enable buyers/tenants to search using filters such as city, price range, area, and property type.
3. Provide image upload and preview functionality.
4. Implement secure authentication and authorization using JWT.
5. Maintain a structured database for users and property listings.
6. Provide a responsive and intuitive user interface.
7. Show nearby transport facilities dynamically within a 300m radius using map APIs.

---

## 3. Existing System

Traditional and some current real estate systems face the following limitations:

* Heavy dependence on brokers or physical advertisements.
* Limited visibility and market reach.
* High costs due to intermediaries.
* Lack of advanced search filters and location insights.

---

## 4. Proposed System

BHUMI resolves the above issues by offering:

* Free and user-friendly property listing with detailed information.
* Integrated map view using Leaflet/OpenStreetMap or Google Maps.
* Filter and search functionality for easy property discovery.
* Dynamic detection of nearby transport locations within 300m.
* Responsive design compatible with all devices.
* Secure login and personalized dashboards.

---

# 5. Module Description

## 5.1 User Authentication Module

**Description:**
Manages registration, login, and secure access for users.

**Functions:**

* User registration with name, email, and password.
* Password encryption using bcrypt.
* JWT-based authentication for secure API access.
* Logout and session handling.

**Importance:**
Ensures secure user access and protects sensitive data.

---

## 5.2 Property Listing Module

**Description:**
Allows users to create and manage their property listings.

**Functions:**

* Add title, description, price, area, and property type.
* Add amenities, boundary wall details, and deposit information.
* Upload images.
* Edit or delete listings.

**Importance:**
Enables sellers to present properties with complete information to potential buyers.

---

## 5.3 Search and Filter Module

**Description:**
Helps buyers find properties that match their requirements.

**Functions:**

* Filter by city, price, area, and property type.
* Sorting options such as latest listings or price-based sorting.

**Importance:**
Improves user experience by narrowing property results.

---

## 5.4 Image Upload and Storage Module

**Description:**
Handles property image uploads and storage.

**Functions:**

* Upload multiple images.
* Preview images before submission.
* Store image URLs in MongoDB or cloud storage.

**Importance:**
Enhances listing quality and helps buyers evaluate properties visually.

---

## 5.5 Nearby Places and Transport Module

**Description:**
Identifies and displays nearby transport and amenities based on property location.

**Functions:**

* Detects nearby bus stops, highways, railways, metros, and airports.
* Uses Leaflet/OpenStreetMap or Google Places API.
* Calculates distance and generates a transport score.
* Displays results within a 300m radius.

**Importance:**
Helps buyers assess location convenience.

---

## 5.6 Database Management Module

**Description:**
Stores and maintains user and property data.

**Functions:**

* Secure storage of user credentials.
* Storage of property details and images.
* Tracking property history for each user.

**Importance:**
Provides reliable and efficient data management.

---

## 5.7 Admin/Management Module

**Description:**
Provides higher-level controls for system monitoring.

**Functions:**

* Admin login.
* Approve or remove property listings.
* Monitor system usage and statistics.

**Importance:**
Ensures content quality and platform regulation.

---

## 5.8 Email Notification Module

**Description:**
Enables direct communication between buyers and sellers using SMTP.

**Functions:**

* Collect buyer’s email and message.
* Send email to seller using Nodemailer and SMTP.
* Supports Gmail SMTP with App Password.

**Importance:**
Improves transparency and eliminates third-party involvement.

---

# 6. System Architecture

(Insert architecture diagram from your image.)

---

# 7. Results and Discussion

The BHUMI system was thoroughly tested to evaluate usability, performance, and accuracy across modules.

## 7.1 Results

**User Authentication:**

* Secure registration and login.
* Protection against unauthorized access.

**Property Listing:**

* Fully functional listing creation, editing, and deletion.
* Image uploads displayed correctly.

**Search and Filter:**

* Accurate filtering based on city, price, and type.
* Results update dynamically.

**Nearby Transport Feature:**

* Correct detection of transport amenities within 300m.
* Transport scores and distance lists calculated accurately.

**Responsive Design:**

* Smooth operation on both desktop and mobile devices.

**Performance:**

* Efficient database queries and API calls.

**Email Messaging:**

* Successful delivery using SMTP and Nodemailer.

---

# 8. Conclusion

The BHUMI Real Estate Listing System mini project was successfully designed and implemented to simplify digital property management. It enables a user to act as both buyer and seller, offering features such as property listing, search, and profile management. The admin role ensures platform regulation and removes inappropriate content.

Overall, BHUMI meets its goal of delivering a structured, scalable, and user-friendly system. It forms a strong foundation for real-world expansion with potential enhancements such as secure payments, advanced GIS mapping, transport integration, and predictive analytics.

---
<img width="1039" height="1181" alt="image" src="https://github.com/user-attachments/assets/1777e2db-d433-4688-8917-de7c1188506d" />


Just tell me.
