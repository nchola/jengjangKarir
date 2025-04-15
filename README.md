# JengjangKarir

A modern web application built with Next.js 15, React 19, and TypeScript, featuring a beautiful UI powered by Radix UI components and Tailwind CSS.

## 🚀 Features

- Modern and responsive UI components using Radix UI
- Dark/Light theme support with next-themes
- Form handling with react-hook-form and zod validation
- Data visualization with Recharts
- Authentication and data storage with Supabase
- Markdown support
- Beautiful animations with tailwindcss-animate
- Fully typed with TypeScript

## 🛠️ Tech Stack

- **Framework:** Next.js 15
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **State Management:** React Hook Form
- **Database:** Supabase
- **Authentication:** Supabase Auth
- **Deployment:** Vercel (recommended)

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/nchola/jengjangKarir.git
cd jengjangKarir
```

2. Install the dependencies:
```bash
pnpm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Project Structure

```
├── app/                # Next.js app directory
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── lib/              # Utility functions and configurations
├── public/           # Static assets
├── styles/           # Global styles and Tailwind CSS config
├── types/            # TypeScript type definitions
└── middleware.ts     # Next.js middleware
```

## 🧩 Available Scripts

- `pnpm dev` - Run development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/nchola/jengjangKarir/issues).

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 