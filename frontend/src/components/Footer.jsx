import {
  FaFacebook,
  FaInstagram,
  FaTwitter,
} from "react-icons/fa";

const sections = [
  {
    items: ["About Us", "Terms & Conditions", "Privacy Policy"]
  }
];

const items = [
  { name: "Facebook", icon: FaFacebook, link: "https://www.facebook.com/" },
  { name: "Instagram", icon: FaInstagram, link: "https://www.instagram.com/" },
  { name: "Twitter", icon: FaTwitter, link: "https://twitter.com/" }
];

const Footer = () => {
  return (
    <div className="w-full mt-24 bg-black text-white py-10 px-4">
      <div className="max-w-[1240px] mx-auto border-b-2 border-gray-800 py-8">
        <div className="flex flex-col items-center md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-8">
          {sections.map((section, index) => (
            <div key={index} className="flex flex-col items-center">
              <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-8">
                {section.items.map((item, i) => (
                  <li key={i} className="text-gray-300 hover:text-blue-400">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center max-w-[1240px] mx-auto px-2 py-4 text-center">
        <p className="text-sm text-gray-400 mb-4">&copy; 2024 AgriForum. All rights reserved.</p>
        <div className="flex space-x-4 text-2xl">
          {items.map((x, index) => (
            <a key={index} href={x.link} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400">
              <x.icon />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
