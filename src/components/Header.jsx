"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react" // icons
import { Button } from "@/components/ui/button"

export default function Header() {
    const [open, setOpen] = useState(false)
    const headerRef = useRef(null)

    useEffect(() => {
        const header = headerRef.current
        if (!header) return

        const updateHeight = () => {
            document.documentElement.style.setProperty(
                "--header-height",
                `${header.offsetHeight}px`
            )
        }

        updateHeight()
        window.addEventListener("resize", updateHeight)
        
        const observer = new MutationObserver(updateHeight)
        observer.observe(header, { childList: true, subtree: true, attributes: true })

        return () => {
            window.removeEventListener("resize", updateHeight)
            observer.disconnect()
        }
    }, [])

  return (
    <header ref={headerRef} className="w-full bg-background/80 backdrop-blur sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-semibold text-primary tracking-tight">
            InfraLens
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/dashboard" className="text-foreground hover:text-primary transition">
            Dashboard
          </Link>
          <Link href="/reports" className="text-foreground hover:text-primary transition">
            Reports
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition">
            About
          </Link>

          <Button asChild className="ml-2">
            <Link href="/report">Submit Report</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={24} className='text-primary' /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-background border-t border-foreground">
          <div className="flex flex-col px-4 py-3 space-y-2">
            <Link
              href="/dashboard"
              className="text-foreground hover:text-primary transition"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/reports"
              className="text-foreground hover:text-primary transition"
              onClick={() => setOpen(false)}
            >
              Reports
            </Link>
            <Link
              href="/about"
              className="text-foreground hover:text-primary transition"
              onClick={() => setOpen(false)}
            >
              About
            </Link>
            <Button asChild onClick={() => setOpen(false)} className="bg-primary hover:bg-chart-1 transition">
              <Link href="/submit">Submit Report</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
