import random
from datetime import datetime, timezone, timedelta
from services.api.app.db.session import engine, Base, SessionLocal
from services.api.app.models.tweet import Tweet
from services.api.app.models.user import User
from services.api.app.core.security import get_password_hash
from services.api.app.services.nlp_service import nlp_service

SEED_TWEETS = [
    # Positive
    ("sam_altman_fan", "OpenAI just dropped the new reasoning architecture. It's shockingly fast and accurate! 🚀 #AI #OpenAI #Innovation", "OpenAI", 0),
    ("tim_cook_apple", "The M4 chip performance and power efficiency in the new MacBook Pro is unreal. 10/10 purchase! 💻🔥 #Apple #MacBook #Tech", "Apple", 0),
    ("tesla_club", "Full Self Driving version 13 handled complex city construction without a single intervention today. Amazing progress! 🚗✨ #Tesla #FSD #Autonomy", "Tesla", 1),
    ("google_cloud_guru", "Google Workspace AI features saved our engineering team at least 6 hours of meeting recaps this week. Loving it! 👍 #Google #Cloud #Productivity", "Google", 1),
    ("crypto_analyst", "Bitcoin and Ethereum institutional inflows reaching all time highs. The market momentum is undeniable! 📈🚀 #Crypto #Bitcoin #Web3", "Crypto", 2),
    ("nvda_investor", "Nvidia Blackwell chips benchmarked at 4x inference speedup. Unbelievable engineering by Jensen and team! 🟢 #Nvidia #AI #Semiconductors", "Nvidia", 2),
    ("dev_jessica", "Microsoft Copilot Studio integration was surprisingly smooth. Deployed a custom agent to production in under an hour! ⚡ #Microsoft #Copilot #Dev", "Microsoft", 3),
    ("design_lead_mark", "The tactile response, sleek glass UI and micro-interactions in this new app feel so incredibly premium. Pure joy! ✨👌 #Design #UIUX", "General", 3),
    ("eco_future", "Solar grid efficiency broke record highs today. Clean energy transition is accelerating faster than expected! ☀️🌿 #CleanEnergy #Sustainability", "General", 4),
    ("sound_expert", "Noise cancellation on these headphones makes flights feel like private library study sessions. Worth every penny! 🎧 #Gadgets #Audio", "Apple", 4),
    ("flutter_dev", "The performance on the new cross-platform runtime is buttery smooth 120fps. Beautiful work by the team! 📱 #MobileDev #React #Expo", "General", 5),
    ("fintech_founder", "Instant cross-border payment settlements settled in 2 seconds with sub-cent fees. The future of banking is here! 💳 #Fintech #Innovation", "General", 5),
    ("ai_researcher", "Open-source weights for high fidelity multi-modal models are advancing at lightspeed. Incredible open research community! 🤖 #OpenSource #AI", "OpenAI", 6),

    # Negative
    ("angry_customer_88", "Apple customer support made me wait 90 minutes just to tell me to reboot my device. Absolute terrible service! 😡👎 #Apple #CustomerFail", "Apple", 0),
    ("dev_dave", "Microsoft Teams audio cut out three times during an executive presentation today. So frustrated with this bloatware! 🤬 #Microsoft #Teams #TechFail", "Microsoft", 1),
    ("tesla_skeptic", "Tesla customer service pushed back my repair appointment by three weeks with zero explanation. Extremely disappointed. 📉 #Tesla #ServiceFail", "Tesla", 1),
    ("pixel_user", "Google Pixel battery drains 25% an hour after the latest security patch. Please release an emergency hotfix! 🚨 #Google #Pixel #Bug", "Google", 2),
    ("wallst_bear", "Nvidia valuation looks heavily stretched at current forward multiples. Expecting severe correction. 📉💥 #Nvidia #Stocks #MarketDrop", "Nvidia", 2),
    ("security_audit", "Critical zero-day vulnerability discovered in widespread enterprise VPN client. Patch immediately! 🚨 #CyberSecurity #Warning", "General", 3),
    ("crypto_skeptic", "Another high-yield DeFi protocol got exploited for $15M due to a flash loan vulnerability. When will this end? 💔 #Crypto #DeFi #Scam", "Crypto", 3),
    ("cloud_admin", "Major multi-region latency spike across cloud datacenters took down our staging environments for hours. 🛑 #Cloud #Downtime", "Microsoft", 4),
    ("gamer_rage", "The server lag and desync in the new season tournament is unplayable. Fix your matchmaking servers! 🎮💥 #Gaming #Lag", "General", 5),
    ("consumer_voice", "Price hiked by 30% while reducing features and adding forced ads. Time to cancel my subscription! 👎 #Ripoff #BadPolicy", "General", 6),

    # Neutral
    ("reuters_wire", "Google parent Alphabet scheduled to report Q3 fiscal earnings tomorrow following market close. #Google #Earnings #Finance", "Google", 0),
    ("press_release_bot", "Apple announces dates for annual worldwide developers conference at Apple Park. Keynotes will stream online. #Apple #WWDC", "Apple", 1),
    ("tech_roundup", "Tesla files patent for novel steer-by-wire dual actuator redundancy system. #Tesla #Automotive #Tech", "Tesla", 2),
    ("semiconductor_daily", "Nvidia and Foxconn partner to establish advanced robotics manufacturing facility in Taiwan. #Nvidia #Robotics #Hardware", "Nvidia", 3),
    ("sec_filing", "Microsoft submits regulatory documentation regarding energy procurement for carbon-neutral data centers. #Microsoft #ESG", "Microsoft", 4),
    ("openai_status", "OpenAI status dashboard indicates scheduled API rate limiter optimization at 04:00 UTC. #OpenAI #API", "OpenAI", 5),
    ("market_indices", "S&P 500 tech index closes flat following modest morning fluctuations in treasury bond yields. #Finance #Markets", "General", 5),
    ("telecom_monitor", "Federal Communications Commission initiates public comment period regarding 6GHz band spectrum allocation. #Telecom #FCC", "General", 6),
    ("weather_channel", "Moderate cloud cover and mild temperatures expected throughout the coastal region this weekend. #Weather #Forecast", "General", 6)
]

def seed_database():
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Seed default user if not existing
        demo_email = "analyst@sentiment.ai"
        user = db.query(User).filter(User.email == demo_email).first()
        if not user:
            print(f"Seeding demo user: {demo_email} (password: password123)...")
            user = User(
                email=demo_email,
                password_hash=get_password_hash("password123"),
                role="admin"
            )
            db.add(user)
            db.commit()

        # Seed sample tweets
        existing_tweets_count = db.query(Tweet).count()
        print(f"Current tweet count in DB: {existing_tweets_count}")

        if existing_tweets_count < 10:
            print("Populating initial realistic tweets dataset...")
            now = datetime.now(timezone.utc)
            
            for author, text, category, days_ago in SEED_TWEETS:
                created_dt = now - timedelta(days=days_ago, hours=random.randint(1, 18), minutes=random.randint(0, 59))
                classification = nlp_service.classify(text)

                tweet = Tweet(
                    author=author,
                    text=text,
                    lang="en",
                    created_at=created_dt,
                    hashtags=classification["hashtags"],
                    sentiment=classification["sentiment"],
                    confidence=classification["confidence"],
                    source="live_stream" if days_ago == 0 else "upload",
                    ingested_at=created_dt + timedelta(seconds=random.randint(5, 30))
                )
                db.add(tweet)
            
            db.commit()
            print(f"Successfully seeded {len(SEED_TWEETS)} sample tweets!")
        else:
            print("Database already populated with tweets. Skipping duplicate seed.")

    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
