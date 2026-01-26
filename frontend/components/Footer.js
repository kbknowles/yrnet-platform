// filepath: frontend/components/Footer.js

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white text-sm py-6 text-center">
      <div className="space-y-1">
        <div>© {new Date().getFullYear()} Alabama High School Rodeo Association</div>
        <div className="text-gray-400">
          Built by <span className="font-medium text-white">KBDev Studio</span>
        </div>
      </div>
    </footer>
  );
}
