import { Task, DayData } from './phases';

export interface PhaseV2 {
  title: string;
  days: string;
  icon: string;
  color: string;
  dim: string;
  data: DayData[];
}

export const PHASES_V2: PhaseV2[] = [
  {
    title: 'Week 1 — Deploy, Debug, Survive',
    days: 'Days 1–4',
    icon: '🚀',
    color: '#ff6b6b',
    dim: 'rgba(255,107,107,.1)',
    data: [
      {
        day: 'Day 1',
        label: 'Deploy something real. Right now. No tutorials.',
        tasks: [
          { t: '🔴 SCENARIO: You just got hired. Your manager says "we need the app deployed by end of day." There is no tutorial for this.', k: 'concept' },
          { t: '💡 WHY THIS FIRST: Most learners spend 2 weeks reading before touching a server. That is backwards. Deployment problems teach Linux, Networking, and Bash faster than any course.', k: 'concept' },
          { t: 'CREATE a free AWS account → launch an Ubuntu 22.04 t2.micro EC2 → open port 22 (SSH) and 80 (HTTP) in the Security Group', k: 'code' },
          { t: 'CONNECT from your terminal: ssh -i your-key.pem ubuntu@YOUR-IP — if you get "Permission denied (publickey)" the key permissions are wrong. Run: chmod 400 your-key.pem', k: 'code' },
          { t: 'INSTALL nginx: sudo apt update && sudo apt install -y nginx && sudo systemctl start nginx', k: 'code' },
          { t: 'VISIT http://YOUR-IP in your browser — you should see "Welcome to nginx". If you don\'t, check: sudo systemctl status nginx — it will tell you exactly what failed.', k: 'code' },
          { t: '⚠️ GOTCHA: t2.micro is free tier but only for 12 months. Set a billing alert at $5 RIGHT NOW in AWS console so you never get a surprise invoice.', k: 'concept' },
          { t: 'DEPLOY a real app — write a 10-line Python Flask app (or Node.js), run it on port 5000: python3 app.py &', k: 'project' },
          { t: '🎤 INTERVIEW: "Tell me about a deployment you did." This is day 1 of your answer. Write 3 sentences about what you just did.', k: 'quiz' },
        ],
      },
      {
        day: 'Day 2',
        label: 'Your app returned 502. What is Nginx and why is it blocking you?',
        tasks: [
          { t: '🔴 SCENARIO: Your app runs on port 5000. Nginx listens on port 80. Users go to port 80 and get a white page that says "502 Bad Gateway." This is the most common error you will see in DevOps.', k: 'concept' },
          { t: '💡 WHY 502 HAPPENS: Nginx received the request on port 80, tried to forward it to your app on port 5000, and your app was not running. Nginx is a reverse proxy — a middleman. The "bad gateway" is Nginx saying "I forwarded your request but nobody answered."', k: 'concept' },
          { t: 'UNDERSTAND the Nginx config file: cat /etc/nginx/sites-available/default — the "location /" block is where you add proxy_pass', k: 'code' },
          { t: 'CONFIGURE the reverse proxy: edit /etc/nginx/sites-available/default and add inside the server block:\nlocation / {\n    proxy_pass http://127.0.0.1:5000;\n    proxy_set_header Host $host;\n    proxy_set_header X-Real-IP $remote_addr;\n}', k: 'code' },
          { t: 'TEST your config before applying it: sudo nginx -t — this saves you from a config typo that breaks the whole server', k: 'code' },
          { t: 'RELOAD (not restart): sudo systemctl reload nginx — reload applies the new config without dropping existing connections. Restart drops everything.', k: 'code' },
          { t: 'VERIFY: curl http://localhost — you should get your app response through Nginx', k: 'code' },
          { t: '⚠️ GOTCHA: "proxy_pass http://localhost:5000" and "proxy_pass http://127.0.0.1:5000" are not always identical. Use 127.0.0.1 — it avoids DNS resolution issues inside the server.', k: 'concept' },
          { t: '📝 NOTE: The X-Real-IP header passes the user\'s real IP address to your app. Without it your app logs show every request coming from 127.0.0.1 (itself) which makes access logs useless.', k: 'concept' },
          { t: '🎤 INTERVIEW: "Explain what a reverse proxy does." Answer: It sits in front of your app, handles SSL termination, load balancing, and forwards requests to the right backend service. Nginx is the most common one.', k: 'quiz' },
        ],
      },
      {
        day: 'Day 3',
        label: 'Your app crashed at 3am and nobody noticed for 6 hours.',
        tasks: [
          { t: '🔴 SCENARIO: Your Python app was running. Then the server ran a security update, rebooted, and your app never came back. It has been returning 502 for 6 hours while you were asleep.', k: 'concept' },
          { t: '💡 THE PROBLEM: You started the app with "python3 app.py &". The & runs it in the background but it dies when the server reboots or the SSH session closes. You need a process manager.', k: 'concept' },
          { t: 'UNDERSTAND what systemd is: it is Linux\'s init system — the first process that starts when the server boots. It manages all other processes. If you want something to survive a reboot, you register it with systemd.', k: 'concept' },
          { t: 'CREATE a systemd service file at /etc/systemd/system/myapp.service:\n[Unit]\nDescription=My Flask App\nAfter=network.target\n\n[Service]\nUser=ubuntu\nWorkingDirectory=/home/ubuntu/app\nExecStart=/usr/bin/python3 app.py\nRestart=always\nRestartSec=5\n\n[Install]\nWantedBy=multi-user.target', k: 'code' },
          { t: 'ENABLE and START: sudo systemctl daemon-reload && sudo systemctl enable myapp && sudo systemctl start myapp', k: 'code' },
          { t: 'TEST that it survives a reboot: sudo reboot — then SSH back in and run: sudo systemctl status myapp', k: 'code' },
          { t: 'READ the logs: sudo journalctl -u myapp -f — the -f flag follows logs in real time like tail -f. This is how you debug crashed services.', k: 'code' },
          { t: '⚠️ GOTCHA: Restart=always means if your app has a bug and crashes immediately, systemd will restart it in a loop forever. Add RestartSec=5 to wait 5 seconds between restarts, giving you time to SSH in and fix it.', k: 'concept' },
          { t: '📝 NOTE: After=network.target means systemd waits for the network to be ready before starting your app. Without this, your app might start before it can reach the database and crash.', k: 'concept' },
          { t: '🎤 INTERVIEW: "How do you ensure a service automatically restarts after a server reboot?" — systemd unit file with WantedBy=multi-user.target and systemctl enable. Be specific about Restart=always vs Restart=on-failure.', k: 'quiz' },
        ],
      },
      {
        day: 'Day 4',
        label: 'The disk is full. The server refuses all connections.',
        tasks: [
          { t: '🔴 SCENARIO: Suddenly every request returns a 500 error. SSH into the server and you see: "No space left on device." The disk is 100% full. Your app logs grew to 40GB overnight.', k: 'concept' },
          { t: '💡 WHY THIS KILLS EVERYTHING: When a disk is full, Linux cannot write anything — including temporary files, socket files, and the swap space that applications need. Everything that tries to write anything fails.', k: 'concept' },
          { t: 'DIAGNOSE: df -h — shows disk usage by partition. du -sh /var/log/* | sort -h — shows which directory is biggest. du -sh /home/ubuntu/app/logs/* — drill down to the exact culprit.', k: 'code' },
          { t: 'IMMEDIATE FIX: find /var/log -name "*.log" -mtime +7 -delete — delete logs older than 7 days. Or: sudo truncate -s 0 /var/log/nginx/access.log — empties the file without deleting it.', k: 'code' },
          { t: 'PERMANENT FIX — set up log rotation for your app. Create /etc/logrotate.d/myapp:\n/home/ubuntu/app/logs/*.log {\n    daily\n    rotate 7\n    compress\n    missingok\n    notifempty\n}', k: 'code' },
          { t: 'CONFIGURE Nginx to limit access log size: add "access_log /var/log/nginx/access.log combined buffer=16k" in nginx.conf — buffering reduces disk writes.', k: 'code' },
          { t: 'SET UP a disk usage alert: add to crontab (crontab -e):\n0 * * * * df -h / | awk \'$5 > "80%" {print $0}\' | mail -s "Disk alert" you@email.com', k: 'code' },
          { t: '⚠️ GOTCHA: sudo rm a huge log file does not immediately free disk space if a process still has the file open. Run: lsof | grep deleted — you will see processes holding deleted files. Restart those services to actually free the space.', k: 'concept' },
          { t: '🎤 INTERVIEW: "Production was down. Disk was full. Walk me through your response." — df -h, find the big directories with du, delete old logs, set up logrotate, add monitoring alert. Say all five steps.', k: 'quiz' },
        ],
      },
    ],
  },
];
