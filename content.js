/*
  ============================================================
  ALL OF THE SITE'S CONTENT LIVES IN THIS FILE.
  Edit the text below; index.html, styles.css and script.js
  never need to change. To hide a section, empty its list: []
  Anything written in [square brackets] is shown highlighted
  as a placeholder, so nothing unfinished slips through.
  Source: source-profiles/Supakorn_Profile_University.md and
  Supakorn_Profile_HighSchool.md (VERIFIED / USER-CONFIRMED facts only).
  ============================================================
*/
window.SITE = {
  name: "Supakorn Surarat",
  initials: "SS",
  role: "Computer Engineering student · The University of Hong Kong",
  location: "Hong Kong SAR",
  headline: "I build systems where hardware meets AI.",
  intro: "Second-year BEng Computer Engineering student on HKU's integrated MSc AI in Engineering track, with a minor in Finance. My recent work ranges from Aerotrack, a Raspberry Pi 5 gimbal that detects and follows people in real time, to machine-learning maps of mangrove forests from satellite images.",
  email: "supakornsurarat@gmail.com", // main contact
  contactNote: "", // e.g. "I'm looking for a summer 2027 internship in embedded systems or AI." Leave empty for a plain line.
  emailSecondary: "u3652527@connect.hku.hk", // university email, shown second
  cvFile: "assets/cv.pdf", // put your CV PDF in the assets folder with this name
  photo: "assets/photo.jpg", // 640 x 800 headshot; set to "" to hide it

  links: [
    { label: "LinkedIn", url: "https://www.linkedin.com/in/supakorn-surarat-200232206" },
    { label: "GitHub", url: "https://github.com/Amp-ss" }
  ],

  // Quick facts shown in the header.
  atAGlance: [
    { label: "Degree", value: "BEng(CE) + MSc AI in Engineering" },
    { label: "CGPA", value: "3.35 · latest semester 3.53" },
    { label: "Code", value: "Python · C/C++ · SQL · Bash" },
    { label: "Languages", value: "Thai · English (IELTS 7.5)" }
  ],

  highlights: [
    { figure: "A+", label: "ENGG1101: Aerotrack, an AI tracking gimbal on Raspberry Pi 5" },
    { figure: "4", label: "merit scholarships since joining HKU, incl. the HKSAR Belt and Road full award" },
    { figure: "2", label: "international invention gold medals with school teams, 2024 (Bali, Tokyo)" },
    { figure: "99.70%", label: "mangrove classification accuracy on Landsat 8" }
  ],

  // Case studies: the first three get a full write-up with a system diagram.
  caseStudies: [
    {
      title: "Aerotrack: vision-based target-tracking gimbal",
      year: "2026",
      context: "ENGG1101 Engineering Challenges · Group E6",
      role: "Visual tracking and sensor integration",
      diagram: ["USB camera", "YOLOv8 nano person detection", "Person ID tracker", "Error vs. anchor point, with deadband", "Proportional gain + smoothing (α = 0.30)", "STS3215 pan / tilt servos"],
      loop: "Feedback: the servos move the camera, and the next frame measures the new error",
      problem: "Radar is expensive and struggles with small drones and birds at low altitude. Aerotrack tests a low-cost alternative: a camera on a pan–tilt gimbal that detects and follows a target using only a Raspberry Pi 5, with people as the safe indoor test case.",
      approach: "I built the VL53L0X time-of-flight distance module: I²C setup, a 20 ms timing budget, polling that never blocks detection, out-of-range handling and an on-screen overlay. I also helped with the tracking code and servo testing, debugged and merged the code for the final prototype, and fixed a Raspberry Pi GPIO library conflict by moving the project into a working virtual environment.",
      result: "YOLOv8 nano ran at 8–12 fps on the Pi's CPU with smooth, stable tracking. Deadbands, smoothing and a 0.3° minimum step removed servo jitter. Distance readings stayed within a few centimetres of a tape measure from 50 to 150 cm. Graded A+.",
      metrics: [{ figure: "A+", label: "final grade" }, { figure: "8–12", label: "fps on Pi 5 CPU" }, { figure: "50–150 cm", label: "distance range verified" }],
      tags: ["Python", "OpenCV", "YOLOv8", "Raspberry Pi 5", "VL53L0X", "I²C"],
      // Design iterations, in order. Photos from the project report.
      gallery: [
        { src: "assets/aerotrack/1-cad-draft.jpg", caption: "First CAD draft (Fusion 360)" },
        { src: "assets/aerotrack/2-first-prototype.jpg", caption: "First prototype" },
        { src: "assets/aerotrack/3-second-prototype.jpg", caption: "Second prototype" },
        { src: "assets/aerotrack/4-final-cad.jpg", caption: "Final design, pivots moved to the camera's optical centre" },
        { src: "assets/aerotrack/5-final-prototype.jpg", caption: "Final prototype with Raspberry Pi 5" }
      ]
    },
    {
      title: "Mapping mangrove forests from satellite images",
      year: "2023–24",
      context: "PCSHS Pathum Thani research project · team",
      role: "Co-developer: proposed the topic, designed the accuracy tests",
      diagram: ["Landsat 8 imagery", "False-colour composite + NDVI", "Supervised classifier (Earth Engine)", "Accuracy validation", "Mangrove area trends"],
      loop: "",
      problem: "Measuring mangrove area by field survey is slow and expensive. We wanted a cheap way to monitor it from space.",
      approach: "Built a land-cover classifier in Google Earth Engine on Landsat 8 false-colour images. The first model confused mangroves with other forest, so we added NDVI as a feature, which raised accuracy. Validated on Samut Songkhram for 2014, 2019 and 2020, then on five more provinces.",
      result: "96.38–99.70% accuracy in Samut Songkhram. Gold Medal (4th place) at the 4th PCSHS Science Symposium 2024 and Best Oral Presentation at the Silapakorn Young Scientist Forum.",
      metrics: [{ figure: "99.70%", label: "accuracy (2020)" }, { figure: "6", label: "provinces tested" }],
      tags: ["Google Earth Engine", "Remote sensing", "NDVI", "Classification"]
    },
    {
      title: "Predicting orange sweetness from colour and peel",
      year: "2023–24",
      context: "Thai–Japanese exchange project with Ritsumeikan Keisho, Hokkaido",
      role: "Project leader",
      diagram: ["Micrometer + refractometer", "Photos → RGB values", "Excel dataset", "Linear regression (Jupyter)", "Sweetness prediction"],
      loop: "",
      problem: "Can you tell how sweet an orange is from the outside? We compared Thai and Japanese varieties.",
      approach: "Measured peel thickness and sugar content, extracted RGB colour values from controlled photos, and fitted single-variable linear regressions in Jupyter Notebook. Split the work between the Thai and Japanese teams when the fruit couldn't cross borders.",
      result: "Green colour value predicted Seyoka orange sweetness with R² = 0.86; peel thickness reached 0.82.",
      metrics: [{ figure: "0.86", label: "R², green colour" }, { figure: "2", label: "countries" }],
      tags: ["Linear regression", "Jupyter", "Excel", "Experimental design"]
    }
  ],

  // Smaller projects shown as compact cards.
  projects: [
    {
      title: "Aphid Spiral Trap",
      year: "2024",
      role: "Experiment design and testing",
      summary: "A chemical-free aphid trap. We 3D-printed ridged surfaces and trap shapes, studied how aphids move, and built a cone trap with an LED for night use.",
      outcome: "Caught up to 78% of aphids, beating sticky paper. Gold Medal, JDIE 2024, Tokyo.",
      tags: ["123D Design", "3D printing"]
    },
    {
      title: "Solar power adoption in Pathum Thani",
      year: "2022–23",
      role: "Author, 14th APEC Cross-Mentoring Research Activity",
      summary: "A year-long mentorship with Prof. Nguyen Trinh Hoang Anh. I used Analytica to forecast the cost-effectiveness of solar panels and assessed social and environmental side effects.",
      outcome: "Earned an invitation to the APEC Youth STEM Conference 2025 in Korea.",
      tags: ["Analytica", "Energy systems"]
    }
  ],

  education: [
    {
      degree: "BEng Computer Engineering, integrated with MSc Artificial Intelligence in Engineering",
      school: "The University of Hong Kong",
      start: "Sep 2025",
      end: "Present",
      result: "CGPA 3.35 · Semester 2 GPA 3.53",
      details: [
        "Minor in Finance",
        "A+ in ENGG1101 Engineering Challenges and CCGL9070 · Distinction in AILT1001 AI Literacy",
        "Now taking: Data Structures and Algorithms, Computer Organization and Microprocessors, Electric Circuit Theory, Corporate Finance"
      ]
    },
    {
      degree: "Science and technology programme (Grades 10–12)",
      school: "Princess Chulabhorn Science High School Pathum Thani, Thailand",
      start: "2022",
      end: "2025",
      result: "GPAX 3.96 / 4.00",
      details: ["POSN Astronomy Olympiad Camp 1 qualifier", "IELTS Academic 7.5 (Listening 8.0, Reading 8.5)"]
    },
    {
      degree: "AFS exchange year",
      school: "Marcos de Niza High School, Tempe, Arizona, USA",
      start: "2021",
      end: "2022",
      result: "AFS Chevron Scholar",
      details: ["One of two students selected in Thailand for the fully funded scholarship"]
    }
  ],

  // stage: "hku" or "school" drives the filter buttons.
  honours: [
    { stage: "hku", kind: "Scholarship", year: "2025", title: "HKSAR Government Belt and Road Scholarship (Thailand)", by: "HKSAR Government Scholarship Fund", note: "Full award covering tuition and living costs" },
    { stage: "hku", kind: "Scholarship", year: "2025–26", title: "HKSAR Government Talent Development Scholarship", by: "HKSAR Government Scholarship Fund", note: "Innovation, Science and Technology" },
    { stage: "hku", kind: "Scholarship", year: "2025–26", title: "HKU Scholarship for Future Leaders", by: "The University of Hong Kong", note: "" },
    { stage: "hku", kind: "Scholarship", year: "2025, 2026", title: "Chevron REACH Scholarship", by: "Chevron and the Institute of International Education", note: "Awarded two years running" },
    { stage: "hku", kind: "Award", year: "2025–26", title: "CAES1001 Certificate of Excellence", by: "Centre for Applied English Studies, HKU", note: "" },
    { stage: "school", kind: "Award", year: "2024", title: "Best Innovation Award and Gold Medal", by: "Indonesia Inventors Day 2024, Bali", note: "KREADTISOL saliva cortisol test kit (team)" },
    { stage: "school", kind: "Award", year: "2024", title: "Gold Medal and INNOPA Special Award", by: "Japan Design, Idea and Invention Expo 2024, Tokyo", note: "Aphid Spiral Trap" },
    { stage: "school", kind: "Award", year: "2024", title: "Gold Medal (4th place)", by: "4th PCSHS Science Symposium, Chiang Rai", note: "Mangrove mapping" },
    { stage: "school", kind: "Award", year: "2024", title: "Gold Medal (4th place)", by: "Change Innovation Awards 2024, Bangkok", note: "KREADTISOL (team)" },
    { stage: "school", kind: "Award", year: "2024", title: "Best Oral Presentation", by: "2nd Silapakorn Young Scientist Forum", note: "Mangrove mapping" },
    { stage: "school", kind: "Award", year: "2024", title: "Selected school presenter", by: "Thailand–Japan Student ICT Fair (Ministry of Education)", note: "Mangrove mapping" },
    { stage: "school", kind: "Scholarship", year: "2021", title: "AFS Chevron Scholarship", by: "AFS Intercultural Programs", note: "1 of 2 students selected in Thailand" }
  ],

  leadership: [
    { stage: "hku", years: "Apr 2026 – now", role: "Event Director", org: "HKU Thai Student Association", note: "Runs logistics and schedules for cultural and orientation events; leads teams of 15+ volunteers" },
    { stage: "hku", years: "2026 – now", role: "Captain", org: "Chi Sun College Badminton Club, HKU", note: "Leads weekly sessions; organised the JCSVIII Inter-Badminton Tournament 2025–26" },
    { stage: "hku", years: "HKU", role: "Faculty Student Ambassador", org: "HKU Faculty of Engineering", note: "Presented the BEng + MSc AIE programme at Information Day; Certificate of Appreciation" },
    { stage: "hku", years: "HKU", role: "Peer English Tutor", org: "Peer Impact Network, CEDARS", note: "Runs weekly conversation workshops for non-local students" },
    { stage: "school", years: "High school", role: "Varsity Basketball Captain", org: "PCSHS Pathum Thani", note: "Captain for two years; Kaesad Games 2024 and 2025" },
    { stage: "school", years: "High school", role: "Vice President, 17th Environmental Camp", org: "PCSHS Pathum Thani", note: "Planned the camp and ran fundraising to cover its costs" }
  ],

  // Each skill names where it was used, so a recruiter can see the evidence.
  skills: [
    { group: "Programming", items: [
      { name: "Python", where: "Aerotrack, ENGG1330" },
      { name: "C/C++", where: "COMP2113 systems programming" },
      { name: "SQL", where: "Database querying" },
      { name: "Bash / Shell", where: "COMP2113, Linux" }
    ] },
    { group: "AI and data", items: [
      { name: "OpenCV, YOLOv8", where: "Aerotrack" },
      { name: "Supervised classification", where: "Mangrove mapping" },
      { name: "Google Earth Engine", where: "Mangrove mapping" },
      { name: "Linear regression, Jupyter", where: "Orange sweetness study" }
    ] },
    { group: "Hardware", items: [
      { name: "Raspberry Pi 5, embedded Linux", where: "Aerotrack" },
      { name: "Sensors over I²C (VL53L0X)", where: "Aerotrack distance module" },
      { name: "Circuit analysis", where: "ENGG1310, ELEC2346" },
      { name: "CAD and 3D printing", where: "Aphid Spiral Trap" }
    ] },
    { group: "Tools and finance", items: [
      { name: "Git, GitHub, Linux / UNIX", where: "Coursework and projects" },
      { name: "Excel, Power BI", where: "Orange study, training course" },
      { name: "Accounting, corporate finance", where: "ACCT1101 (B+), FINA1310" }
    ] },
    { group: "Languages", items: [
      { name: "Thai", where: "Native" },
      { name: "English", where: "Fluent · IELTS 7.5" },
      { name: "Cantonese", where: "Beginner · CHIN9511" }
    ] }
  ]
};
