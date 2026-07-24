from app.db.session import SessionLocal
from app.models import City, Category, Destination

def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(City).count() > 0:
            print("Database already seeded!")
            return

        print("Seeding cities...")
        cities = {
            "Goa": City(name="Goa", state="Goa", country="India"),
            "Manali": City(name="Manali", state="Himachal Pradesh", country="India"),
            "Hampi": City(name="Hampi", state="Karnataka", country="India"),
            "Munnar": City(name="Munnar", state="Kerala", country="India"),
            "Jaipur": City(name="Jaipur", state="Rajasthan", country="India"),
            "Andaman": City(name="Andaman", state="Andaman & Nicobar", country="India"),
        }
        for city in cities.values():
            db.add(city)
        db.commit()

        print("Seeding categories...")
        categories = {
            "Beach": Category(name="Beach", description="Beautiful sandy beaches", icon="umbrella"),
            "Mountain": Category(name="Mountain", description="Scenic hills and mountains", icon="mountain"),
            "Heritage": Category(name="Heritage", description="Historical and cultural heritage sites", icon="landmark"),
        }
        for cat in categories.values():
            db.add(cat)
        db.commit()

        print("Seeding destinations...")
        destinations = [
            Destination(
                name="Goa",
                description="Beautiful beaches, water sports, and vibrant nightlife.",
                latitude=15.2993,
                longitude=74.1240,
                rating=4.8,
                image_url="https://picsum.photos/600/400?random=1",
                city_id=cities["Goa"].id,
                category_id=categories["Beach"].id
            ),
            Destination(
                name="Manali",
                description="Scenic snow-capped valleys and mountain adventure sports.",
                latitude=32.2396,
                longitude=77.1887,
                rating=4.7,
                image_url="https://picsum.photos/600/400?random=2",
                city_id=cities["Manali"].id,
                category_id=categories["Mountain"].id
            ),
            Destination(
                name="Hampi",
                description="Ancient ruins of Vijayanagara and historical boulder landscapes.",
                latitude=15.3350,
                longitude=76.4600,
                rating=4.6,
                image_url="https://picsum.photos/600/400?random=3",
                city_id=cities["Hampi"].id,
                category_id=categories["Heritage"].id
            ),
            Destination(
                name="Munnar",
                description="Lush tea plantations, winding roads, and cool mountain mist.",
                latitude=10.0889,
                longitude=77.0595,
                rating=4.9,
                image_url="https://picsum.photos/600/400?random=4",
                city_id=cities["Munnar"].id,
                category_id=categories["Mountain"].id
            ),
            Destination(
                name="Jaipur",
                description="The Pink City, known for royal palaces, forts, and rich heritage.",
                latitude=26.9124,
                longitude=75.7873,
                rating=4.7,
                image_url="https://picsum.photos/600/400?random=5",
                city_id=cities["Jaipur"].id,
                category_id=categories["Heritage"].id
            ),
            Destination(
                name="Andaman",
                description="Exotic beaches, coral reefs, and pristine blue ocean waters.",
                latitude=11.7401,
                longitude=92.6586,
                rating=4.9,
                image_url="https://picsum.photos/600/400?random=6",
                city_id=cities["Andaman"].id,
                category_id=categories["Beach"].id
            ),
        ]
        for dest in destinations:
            db.add(dest)
        db.commit()
        print("Database successfully seeded!")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()
