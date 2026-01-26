# Campus Feed - AI-Powered Campus Community Platform
A modern web application that uses AI to automatically classify and organize campus posts into events, lost & found items, and announcements. Built for the Headout Hackathon 2025.

## 🚀 Features

- **AI-Powered Classification**: Automatically categorizes posts using OpenAI GPT and Google Gemini
- **Smart Event Management**: RSVP functionality for campus events
- **Lost & Found System**: Efficient tracking of lost and found items
- **Image Upload**: Add images to posts for better visibility
- **Real-time Feed**: Live updates of campus activities
- **Responsive Design**: Works seamlessly on desktop and mobile

## 🏗️ Tech Stack
### Backend
- **FastAPI**: Modern Python web framework
- **OpenAI GPT**: Text classification and processing
- **Google Gemini**: Alternative AI provider for text analysis
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server

### Frontend
- **React**: Modern JavaScript library for UI
- **Axios**: HTTP client for API communication
- **CSS3**: Custom styling with responsive design

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/JayrajSinh16/headout_hackathon_2206020.git
cd headout_hackathon_2206020
```

### 2. Backend Setup

#### Install Python Dependencies
```bash
cd campus-feed-backend
pip install -r requirements.txt
```

#### Environment Configuration
1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit `.env` file and add your API keys:
```env
# Required for AI classification
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_gemini_api_key_here
```

#### Start the Backend Server
```bash
python main.py
```

The backend will be available at: `http://localhost:8000`

### 3. Frontend Setup

#### Install Node Dependencies
```bash
cd campus-feed-frontend
npm install
```

#### Start the Frontend Development Server
```bash
npm start
```

The frontend will be available at: `http://localhost:3000`

## 🔧 Configuration

### API Keys Setup

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/account/api-keys)
2. Create a new API key
3. Add it to your `.env` file as `OPENAI_API_KEY`

#### Google Gemini API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env` file as `GOOGLE_API_KEY`

### AI Provider Configuration
- The app defaults to **Google Gemini** (recommended)
- Fallback to **OpenAI** if Gemini fails
- Manual fallback classification if both APIs fail

## 🚀 Usage

### Creating Posts
1. Type your message in the input box
2. Optionally add an image using the "📷 Add Image" button
3. Click the send button (↑)
4. AI will classify your post and show a preview
5. Review and post to the feed

### Post Types
- **Events**: Workshops, meetings, competitions, festivals
- **Lost & Found**: Lost or found items on campus
- **Announcements**: Official notices and updates

### RSVP to Events
- Click "Going", "Maybe", or "Not going" on event posts
- See real-time RSVP counts from other users



