import { Link } from "react-router-dom";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";

/* ================= COLORS ================= */
const COLORS = ["#4F46E5", "#22C55E", "#3B82F6", "#F59E0B", "#EF4444"];

/* ================= DUMMY DATA ================= */

// SIS
const STUDENTS_BY_CLASS = [
  { name: "Class I", value: 120 },
  { name: "Class II", value: 95 },
  { name: "Class III", value: 70 },
];

const ATTENDANCE = [
  { day: "Mon", value: 88 },
  { day: "Tue", value: 92 },
  { day: "Wed", value: 84 },
  { day: "Thu", value: 90 },
  { day: "Fri", value: 86 },
];

const GENDER_RATIO = [
  { name: "Boys", value: 160 },
  { name: "Girls", value: 125 },
];

// Communication
const COMM_STATS = [
  { name: "Messages", value: 140 },
  { name: "Notices", value: 32 },
  { name: "Complaints", value: 12 },
];

const COMM_STATUS = [
  { name: "Delivered", value: 160 },
  { name: "Pending", value: 24 },
];

// Calendar
const EVENT_TYPES = [
  { name: "Academic", value: 6 },
  { name: "Sports", value: 3 },
  { name: "Meetings", value: 3 },
];

// Fees
const FEES_STATUS = [
  { name: "Collected", value: 18 },
  { name: "Pending", value: 7 },
];

const FEES_MONTHLY = [
  { month: "Jan", value: 6 },
  { month: "Feb", value: 8 },
  { month: "Mar", value: 4 },
];

// Admission
const ADMISSION_FUNNEL = [
  { name: "Enquiry", value: 80 },
  { name: "Applied", value: 55 },
  { name: "Confirmed", value: 30 },
];

/* ================= DASHBOARD ================= */

export default function AdminMasterDashboard() {
  return (
    <div className="p-4 space-y-6 bg-gray-100 min-h-screen">

      {/* ===== TOP MAJOR MODULES ===== */}
      <div className="grid grid-cols-6 gap-3">
        <TopCard title="Admin SIS" value="285 Students" to="/admin" />
        <TopCard title="Communication" value="184 Logs" to="/communication" />
        <TopCard title="Calendar" value="12 Events" to="/admincalendar" />
        <TopCard title="Admission" value="30 Confirmed" to="/admission" />
        <TopCard title="HR Module" value="42 Staff" to="/hr" />
        <TopCard title="Fees" value="₹18L Collected" to="/fees" />
      </div>

      {/* ===== SIS ===== */}
      <Section title="">
        <Grid3>
          <Card title="Students by Class">
            <PieBlock data={STUDENTS_BY_CLASS} />
          </Card>

          <Card title="Weekly Attendance">
            <BarBlock data={ATTENDANCE} x="day" />
          </Card>

          <Card title="Gender Ratio">
            <PieBlock data={GENDER_RATIO} />
          </Card>
        </Grid3>
      </Section>

      {/* ===== COMMUNICATION ===== */}
      <Section title="">
        <Grid3>
          <Card title="Communication Count">
            <BarBlock data={COMM_STATS} x="name" />
          </Card>

          <Card title="Delivery Status">
            <PieBlock data={COMM_STATUS} />
          </Card>

          <Card title="Quick Access">
            <List>
              <Item to="/communication/notices">Notices</Item>
              <Item to="/communication/messages">Messages</Item>
              <Item to="/communication/complaints">Complaints</Item>
            </List>
          </Card>
        </Grid3>
      </Section>

      {/* ===== CALENDAR ===== */}
      <Section title="">
        <Grid3>
          <Card title="Event Types">
            <PieBlock data={EVENT_TYPES} />
          </Card>

          <Card title="Upcoming Events">
            <Muted>• PTM – 18 Feb</Muted>
            <Muted>• Annual Day – 25 Feb</Muted>
            <Muted>• Exam – 5 Mar</Muted>
            <LinkText to="/admincalendar">Open Calendar</LinkText>
          </Card>

          <Card title="This Month">
            <Big>12</Big>
            <Muted>Total Scheduled Events</Muted>
          </Card>
        </Grid3>
      </Section>

      {/* ===== FEES ===== */}
      <Section title="">
        <Grid3>
          <Card title="Collection Status (₹ in Lakh)">
            <BarBlock data={FEES_STATUS} x="name" />
          </Card>

          <Card title="Monthly Collection">
            <BarBlock data={FEES_MONTHLY} x="month" />
          </Card>

          <Card title="Summary">
            <Muted>Total Due: ₹25L</Muted>
            <Muted>Collected: ₹18L</Muted>
            <Muted>Pending: ₹7L</Muted>
            <LinkText to="/fees">Go to Fees</LinkText>
          </Card>
        </Grid3>
      </Section>

      {/* ===== ADMISSION ===== */}
      <Section title="">
        <Grid3>
          <Card title="Admission Funnel">
            <PieBlock data={ADMISSION_FUNNEL} />
          </Card>

          <Card title="Status">
            <Muted>New Enquiries Today: 6</Muted>
            <Muted>Confirmed This Month: 30</Muted>
            <LinkText to="/admission">Open Admission</LinkText>
          </Card>
        </Grid3>
      </Section>

    </div>
  );
}

/* REUSABLE  */

const TopCard = ({ title, value, to }) => (
  <Link to={to} className="bg-white p-4 rounded-xl shadow hover:shadow-md">
    <p className="text-sm text-indigo-600">{title}</p>
    <p className="font-bold text-lg">{value}</p>
  </Link>
);

const Section = ({ title, children }) => (
  <section>
    <h2 className="text-lg font-semibold mb-4">{title}</h2>
    {children}
  </section>
);

const Grid3 = ({ children }) => (
  <div className="grid grid-cols-3 gap-4">{children}</div>
);

const Card = ({ title, children }) => (
  <div className="bg-white p-4 rounded-xl shadow">
    <h3 className="font-medium mb-3">{title}</h3>
    {children}
  </div>
);

const PieBlock = ({ data }) => (
  <div className="h-44">
    <ResponsiveContainer>
      <PieChart>
        <Pie data={data} dataKey="value" outerRadius={70}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const BarBlock = ({ data, x }) => (
  <div className="h-44">
    <ResponsiveContainer>
      <BarChart data={data}>
        <XAxis dataKey={x} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill="#4F46E5" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

const List = ({ children }) => <div className="space-y-2">{children}</div>;

const Item = ({ to, children }) => (
  <Link to={to} className="block text-blue-600 hover:underline">
    {children}
  </Link>
);

const Big = ({ children }) => (
  <div className="text-4xl font-bold text-indigo-600">{children}</div>
);

const Muted = ({ children }) => (
  <p className="text-sm text-gray-500">{children}</p>
);

const LinkText = ({ to, children }) => (
  <Link to={to} className="text-sm text-blue-600 underline">
    {children}
  </Link>
);
