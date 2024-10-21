# Anime Inventory Database Application

## Overview

The Anime Inventory Database Application allows users to explore and manage their anime collections. Users can get random anime recommendations, add anime to their collections, create custom anime entries, and assign custom genres. The application uses PostgreSQL for data storage, include cloud storage to include images and implements a secret password for sensitive actions, ensuring user actions are secure.

## Features

- **Random Anime Recommendations**: Get a randomly selected anime series on the homepage.
- **Add to Collection**: Users can add their favorite anime series to their personal collections.
- **Custom Anime Creation**: Users can create and manage custom anime entries.
- **Custom Genre Management**: Users can define their own genres for categorizing anime.
- **Search Functionality**: Quickly search through a large collection of anime series with the filters.
- **Image Storage**: Anime images are stored in separate cloud storage for easy access.
- **Secure Actions**: Sensitive actions like deleting and updating require a secret password.

## Database Schema

The application uses the following tables:

- **anime_series**: Contains details about anime series.
- **anime_collections**: Tracks user collections and links to anime series.
- **genre**: Stores unique genres associated with anime series.
- **anime_genre**: A join table to create a many-to-many relationship between anime series and genres.

## Technologies Used

- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Storage**: Images arent stored in db but separate Cloud storage is used for images
- **Libraries**: `pg` for PostgreSQL interaction (no ORM)

## Acknowledgments

This project was created as part of an curriculum from [Anime Inventory Application](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application).
[theodinproject](https://www.theodinproject.com) is open source community driven project which provide one of the best resources for leanrning web developement.
Feel free to check its resources and if possible contribute it
