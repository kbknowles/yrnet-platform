export default function Footer() {
  return (
    <footer className="bg-black text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm">
        © {new Date().getFullYear()} Alabama High School Rodeo Association
      </div>
    </footer>
  );
}
