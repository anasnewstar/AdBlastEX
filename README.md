# AdBlast - The Ultimate Ad Delivery Platform

AdBlast is a web-based platform designed to maximize ad impressions and clicks while ensuring users remain on the landing page. It uses a combination of automated ad delivery, psychological triggers, strategic ad placement, interactive games, and an engaging image gallery to increase user retention and ad exposure.

## Features

### Automatic Ad Delivery
- Opens ad tabs automatically after a user lands on the page (initial delay: 3 seconds)
- Continues to open new tabs at regular intervals (30-40 seconds)
- Stops after reaching a configurable maximum number of tabs (default: 20)

### Engagement-Boosting Elements
- **Floating Ad Banner**: Non-intrusive floating ads that attract attention
- **Countdown Timer**: Creates urgency to encourage clicks
- **Interactive Pop-ups**: Appear after user interactions (scrolling, etc.)
- **Social Proof Notifications**: Shows how many others have clicked the ad
- **Psychological Triggers**: Using colors and copy that drive action

### Image Gallery
- **Responsive Image Carousel**: Automatically rotates through featured images
- **Expanded Gallery View**: Modal with a grid of high-quality images
- **Category-Based Content**: Organized by themes (travel, technology, nature, etc.)
- **Auto-Rotation**: Hands-free image viewing with pause on hover
- **Strategic Ad Integration**: Trigger points throughout the image browsing experience

### Interactive Games
- **Tic-Tac-Toe**: Classic two-player strategy game against the computer
- **Memory Match**: Test memory skills by finding matching pairs of cards
- **Rock Paper Scissors**: The timeless game of chance against the computer
- Games keep users engaged on the page longer, increasing ad exposure
- Game actions occasionally trigger ad opportunities

### Admin Panel
- **Ad Management**: Upload and configure different types of ads (URL, image, video, HTML)
- **Ad Scheduling**: Configure when and how often ads appear
- **Ad Positioning**: Choose where ads appear on the screen
- **Gallery Management**: Add, edit, and organize images for the gallery section
- **Statistics**: Track impressions, clicks, and other important metrics
- **Settings**: Customize the platform's behavior

### User Accounts & Custom Ad Pages
- **User Registration**: Visitors can create their own accounts
- **User Dashboard**: Personalized dashboard for managing ad pages
- **Custom Ad Pages**: Users can create their own ad pages similar to the main landing page
- **Gallery Management**: Users can upload and manage images for their custom pages
- **Ad Configuration**: Control ad behavior on their pages
- **Analytics**: Track page views, ad impressions, and clicks
- **Share Links**: Get unique URLs to share custom ad pages with others

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Basic understanding of HTML, CSS, and JavaScript (for customization)

### Installation
1. Clone or download this repository
2. Host the files on any web server or file hosting service
3. Open `index.html` in a web browser to see the landing page
4. Access the admin panel at `admin/login.html`
5. Access user registration at `user/register.html`

### Admin Access
- **Passkey**: admin001

## File Structure

```
adblast/
├── index.html               # Main landing page
├── css/
│   ├── styles.css           # Styles for landing page
│   ├── admin.css            # Styles for admin panel
│   └── user.css             # Styles for user pages
├── js/
│   ├── adDelivery.js        # Ad delivery logic
│   ├── main.js              # Main landing page functionality
│   ├── games.js             # Interactive games functionality
│   └── gallery.js           # Image gallery functionality
├── admin/
│   ├── login.html           # Admin login page
│   ├── dashboard.html       # Admin dashboard
│   ├── ad-management.html   # Ad management page
│   ├── gallery-management.html # Gallery management page
│   ├── settings.html        # Settings page
│   └── js/
│       └── admin.js         # Admin panel functionality
├── user/
│   ├── register.html        # User registration page
│   ├── login.html           # User login page
│   ├── dashboard.html       # User dashboard
│   ├── create-page.html     # Page for creating custom ad pages
│   ├── my-pages.html        # Manage user's custom pages
│   └── ad-manager.html      # User ad management
└── images/                  # Project images
```

## Usage

### Landing Page
The landing page is what your visitors will see. It includes:
- A clean, modern design with your branding
- Automatic ad delivery functionality
- Interactive elements to increase engagement
- Engaging games to keep users on the page longer
- Image gallery with visual content to explore

### Image Gallery
The image gallery features:
1. **Main Carousel**: Auto-rotating showcase of featured images with captions
2. **Expanded View**: Click "View More Images" to see the full gallery in a modal
3. **Category Organization**: Images sorted by themes for easy exploration
4. **Interactive Elements**:
   - Navigation arrows for manual browsing
   - Indicator dots for direct slide access
   - Responsive design for all devices

### Interactive Games
The landing page includes three games:
1. **Tic-Tac-Toe**: Play against the computer in this classic game
2. **Memory Match**: Find matching pairs of cards to test your memory
3. **Rock Paper Scissors**: Choose rock, paper, or scissors to compete against the computer

These games are designed to:
- Keep users on the page longer, increasing ad exposure
- Create additional opportunities for ad delivery
- Make the site more engaging and enjoyable for users

### Admin Panel
The admin panel allows you to:
1. **Manage Ads**: Create, edit, and delete ads
2. **Manage Gallery**: Add and organize images for the gallery section
3. **Configure Settings**: 
   - Set initial delay and interval between ads
   - Set maximum number of tabs
   - Configure the default ad URL
   - Control game and gallery boost settings for ad delivery
4. **Toggle Features**:
   - Enable/disable floating ads
   - Enable/disable countdown timer
   - Enable/disable interactive pop-ups
   - Enable/disable social proof notifications
   - Enable/disable game and gallery ad boosts

### User Account Features
AdBlast now allows users to create their own ad pages:
1. **Registration & Login**: Simple signup process to create an account
2. **User Dashboard**: Personalized dashboard showing stats and page information
3. **Create Ad Pages**: Users can create custom ad pages that look similar to the main landing page
4. **Custom Branding**: Customize colors, images, and content to match personal branding
5. **Upload Gallery Images**: Users can add their own images to their page's gallery
6. **Configure Ad Settings**: Control how ads appear on the custom page
7. **Share Unique URL**: Each page gets a unique URL that can be shared with others
8. **Analytics**: Track page views, ad impressions, and clicks

## Customization

### Changing the Default Ad URL
1. Log in to the admin panel
2. Go to Settings
3. Update the "Default Ad URL" field
4. Click "Save Settings"

### Customizing the Look and Feel
- Modify `css/styles.css` to change the landing page appearance
- Replace the logo and images with your own
- Edit the copy in `index.html` to match your brand voice

### Advanced Customization
- Modify `js/adDelivery.js` to change the ad delivery logic
- Edit `js/games.js` to customize the game behavior
- Update `js/gallery.js` to adjust gallery functionality and images
- Add new features by extending the existing JavaScript files
- Create additional pages and link them to the main page

## Important Notes

### Popup Blockers
Modern browsers have popup blockers that may interfere with AdBlast's functionality. Users may need to allow popups for your website for the full experience.

### Ethical Considerations
While AdBlast is designed to maximize ad engagement, we encourage ethical use that respects user experience. Consider:
- Being transparent about ad delivery
- Not using deceptive tactics that trick users
- Respecting user choice when they indicate they don't want to see ads

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Support
For questions, issues, or feature requests, please open an issue on the GitHub repository or contact the support team.

---

**Note**: AdBlast is designed for demonstration purposes. When implementing on a production site, ensure you comply with all relevant laws, regulations, and platform policies regarding advertisements. 