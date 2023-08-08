INSERT INTO users (name, email, password)
VALUES (
    'Eva Stanley',
    'sebastianguerra@ymail.com',
    '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'
  ),(
    'Blank Corner',
    'jacksonrose@hotmail.com',
    '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'
  ),(
    'Dominic Parks',
    'victorialackwell@outlook.com',
    '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'
  );

INSERT INTO properties (
  owner_id, 
  title,
  description,
  thumbnail_photo_url,
  cover_photo_url,
  cost_per_night,
  parking_spaces,
  number_of_bathrooms,
  number_of_bedrooms,
  country,
  street,
  city,
  province,
  post_code,
  active
  )
  VALUES (1, 'Speed lamp', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 5000, 2, 3, 2, 'Canada', '123 Vancouver street', 'Vancouver', 'British Columbia', 'VVV VVV', true),
         (2, 'Cat tower', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg', 1200, 2, 3, 2, 'Canada', '123 Paradise valley road', 'Squamish', 'British Columbia', 'VVV VVV', true),
         (2, 'Kuma castle', 'description', 'https://images.pexels.com/photos/2121121/pexels-photo-2121121.jpeg?auto=compress&cs=tinysrgb&h=350', ' https://images.pexels.com/photos/2080018/pexels-photo-2080018.jpeg', 500, 2, 3, 2, 'Canada', '888 Aloha avenue', 'Tofino', 'British Columbia', 'VVV VVV', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
  VALUES ('2018-09-11', '2018-09-26', 2, 3),
         ('2019-01-04', '2019-02-01', 1, 2),
         ('2021-10-01', '2021-10-14', 3, 1);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
  VALUES (3, 2, 1, 3, 'messages'),
         (2, 1, 2, 4, 'messages'),
         (1, 3, 3, 2, 'messages');