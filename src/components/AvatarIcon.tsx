import React from 'react';

interface AvatarIconProps {
  id: string;
  className?: string;
  color?: string;
}

export const AvatarIcon: React.FC<AvatarIconProps> = ({ id, className = "w-12 h-12", color = "#D4AF37" }) => {
  switch (id) {
    case 'avatar-gentleman':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#141416" stroke={color} strokeWidth="2"/>
          {/* Hair & Face Outline */}
          <path d="M50 20C42 20 38 24 38 32C38 36 40 40 40 44C38 45 37 47 38 49C39 51 40 50 41 50C42 54 44 57 47 59C47 62 45 65 42 67C46 69 49 67 50 65C51 67 54 69 58 67C55 65 53 62 53 59C56 57 58 54 59 50C60 50 61 51 62 49C63 47 62 45 60 44C60 40 62 36 62 32C62 24 58 20 50 20Z" fill={color}/>
          {/* Suited Silhouette */}
          <path d="M25 85C25 75 35 70 50 70C65 70 75 75 75 85V90H25V85Z" fill="#1A1A1C" stroke={color} strokeWidth="1.5"/>
          <path d="M50 70L44 80H56L50 70Z" fill={color}/>
          <path d="M50 80L47 88H53L50 80Z" fill="#FFF"/>
          {/* Sleek Glasses */}
          <rect x="42" y="38" width="7" height="4" rx="1" fill="#141416" stroke={color} strokeWidth="1.5"/>
          <rect x="51" y="38" width="7" height="4" rx="1" fill="#141416" stroke={color} strokeWidth="1.5"/>
          <path d="M49 40H51" stroke={color} strokeWidth="1.5"/>
        </svg>
      );
    case 'avatar-hipster':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#141416" stroke={color} strokeWidth="2"/>
          {/* Hipster Hair & Huge Beard */}
          <path d="M50 15C39 15 35 22 35 30C35 34 38 31 40 33C40 39 42 41 42 45C39 47 38 49 40 51C42 51 43 49 44 48C43 55 45 61 50 74C55 61 57 55 56 48C57 49 58 51 60 51C62 49 61 47 58 45C58 41 60 39 60 33C62 31 65 34 65 30C65 22 61 15 50 15Z" fill={color}/>
          {/* Mustache */}
          <path d="M43 53C47 53 49 50 50 49C51 50 53 53 57 53C59 53 61 51 60 48C55 48 52 46 50 48C48 46 45 48 40 48C39 51 41 53 43 53Z" fill="#141416" stroke={color} strokeWidth="1"/>
          {/* Glasses */}
          <rect x="38" y="35" width="10" height="8" rx="2" fill="#141416" stroke={color} strokeWidth="2"/>
          <rect x="52" y="35" width="10" height="8" rx="2" fill="#141416" stroke={color} strokeWidth="2"/>
          <path d="M48 38H52" stroke={color} strokeWidth="2"/>
          {/* Shirt */}
          <path d="M30 85C30 75 38 72 50 72C62 72 70 75 70 85V90H30V85Z" fill="#232326" stroke={color} strokeWidth="1.5"/>
          {/* Suspenders */}
          <path d="M38 72V90" stroke={color} strokeWidth="2"/>
          <path d="M62 72V90" stroke={color} strokeWidth="2"/>
        </svg>
      );
    case 'avatar-casual':
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#141416" stroke={color} strokeWidth="2"/>
          {/* Combed back Pompadour hair with stubble */}
          <path d="M50 18C41 18 36 21 35 30C34 39 37 40 37 43C35 44 35 46 36 48C37 50 38 49 39 48C40 52 42 55 45 57C45 61 43 63 41 65C45 66 48 64 49 63C50 64 51 64 53 63C54 64 57 66 61 65C59 63 57 61 57 57C60 55 62 52 63 48C64 49 65 50 66 48C67 46 67 44 65 43C65 40 68 39 67 30C66 21 61 18 50 18Z" fill={color}/>
          <circle cx="44" cy="38" r="2" fill="#141416"/>
          <circle cx="56" cy="38" r="2" fill="#141416"/>
          {/* Smile */}
          <path d="M46 51C48 53 52 53 54 51" stroke="#141416" strokeWidth="2" strokeLinecap="round"/>
          {/* T-Shirt */}
          <path d="M28 85C28 78 36 74 50 74C64 74 72 78 72 85V90H28V85Z" fill="#1E201D" stroke={color} strokeWidth="1.5"/>
          <path d="M44 74C44 77 56 77 56 74" fill="#141416" stroke={color} strokeWidth="1.5"/>
        </svg>
      );
    case 'avatar-cool':
    default:
      return (
        <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="48" fill="#141416" stroke={color} strokeWidth="2"/>
          {/* Beanie Hat & Big Beard */}
          <path d="M50 14C38 14 34 22 34 30L36 38C34 39 34 42 35 44C36 46 37 45 38 44C39 50 41 57 44 66C44 69 42 71 39 73C43 75 47 72 49 70C51 72 55 75 59 73C56 71 54 69 54 66C57 57 59 50 60 44C61 45 62 46 63 44C64 42 64 39 62 38L64 30C64 22 60 14 50 14Z" fill={color}/>
          {/* Beanie brim */}
          <rect x="33" y="24" width="34" height="6" rx="2" fill="#141416" stroke={color} strokeWidth="1.5"/>
          {/* Cool Sunglasses */}
          <path d="M35 36C35 34 47 34 47 36C47 39 35 39 35 36Z" fill="#141416" stroke={color} strokeWidth="1.5"/>
          <path d="M53 36C53 34 65 34 65 36C65 39 53 39 53 36Z" fill="#141416" stroke={color} strokeWidth="1.5"/>
          <path d="M47 36H53" stroke={color} strokeWidth="1.5"/>
          {/* Leather Jacket Silhouette */}
          <path d="M26 85C26 77 34 74 50 74C66 74 74 77 74 85V90H26V85Z" fill="#0A0A0B" stroke={color} strokeWidth="2"/>
          <path d="M45 74L35 88" stroke={color} strokeWidth="2"/>
          <path d="M55 74L65 88" stroke={color} strokeWidth="2"/>
        </svg>
      );
  }
};
