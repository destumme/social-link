export default function BrandIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Background rounded square */}
      <rect
        x="1"
        y="0.5"
        width="20"
        height="21"
        rx="4"
        className="fill-secondary"
      />
      {/* Bookmark outline */}
      <g transform="translate(1,1) scale(0.80)">
        <path
          d="M4 17.9808V9.70753C4 6.07416 4 4.25748 5.17157 3.12874C6.34315 2 8.22876 2 12 2C15.7712 2 17.6569 2 18.8284 3.12874C20 4.25748 20 6.07416 20 9.70753V17.9808C20 20.2867 20 21.4396 19.2272 21.8523C17.7305 22.6514 14.9232 19.9852 13.59 19.1824C12.8168 18.7168 12.4302 18.484 12 18.484C11.5698 18.484 11.1832 18.7168 10.41 19.1824C9.0768 19.9852 6.26947 22.6514 4.77285 21.8523C4 21.4396 4 20.2867 4 17.9808Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1"
        />
      </g>
      {/* Smile Plus - scaled and centered inside bookmark */}
      <g transform="translate(7, 6) scale(0.30)" strokeWidth="2.25">
        <path
          d="M21.3 10.5C21.4311 11.1462 21.5 11.8151 21.5 12.5C21.5 18.0228 17.0228 22.5 11.5 22.5C5.97715 22.5 1.5 18.0228 1.5 12.5C1.5 6.97715 5.97715 2.5 11.5 2.5C12.1849 2.5 12.8538 2.56886 13.5 2.70004"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          key="0"
        />
        <path
          d="M19.494 1.5V7.5M22.5 4.494L16.5 4.494"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          key="1"
        />
        <path
          d="M7.5 15.5C8.41212 16.7144 9.86433 17.5 11.5 17.5C13.1357 17.5 14.5879 16.7144 15.5 15.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          key="2"
        />
        <path
          d="M15.125 8.887V9.41649M7.875 8.887V9.41649M8.25 9.25C8.25 8.83579 8.08211 8.5 7.875 8.5C7.66789 8.5 7.5 8.83579 7.5 9.25C7.5 9.66421 7.66789 10 7.875 10C8.08211 10 8.25 9.66421 8.25 9.25ZM15.5 9.25C15.5 8.83579 15.3321 8.5 15.125 8.5C14.9179 8.5 14.75 8.83579 14.75 9.25C14.75 9.66421 14.9179 10 15.125 10C15.3321 10 15.5 9.66421 15.5 9.25Z"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          key="3"
        />
      </g>
    </svg>
  );
}
