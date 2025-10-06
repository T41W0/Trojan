import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Tega's Food - Food Delivery",
  description: "Order delicious food from your favorite restaurants and get it delivered to your doorstep",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster position="top-right" />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}