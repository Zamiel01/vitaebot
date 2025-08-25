"use client"
import React, { useState, useRef, useCallback, useEffect } from "react"
import { CVForm } from "@/components/cv-form"
import { CVPreview } from "@/components/cv-preview"
import { TemplateSelector } from "@/components/template-selector"
import type { CVData, Template } from "@/types/cv"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas-pro"
import { auth } from "@/lib/firebase"
import { onAuthStateChanged, signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { User, LogOut } from "lucide-react"

const initialCVData: CVData = {
  personalInfo: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    headline: "",
    profileImage: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  publications: [],
  volunteering: [],
  awards: [],
  interests: [],
}

export default function CVBuilder() {
  const [cvData, setCVData] = useState<CVData>(initialCVData)
  const [selectedTemplate, setSelectedTemplate] = useState<Template>("james-watson")
  const [formWidth, setFormWidth] = useState(320)
  const [isResizing, setIsResizing] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const resizeRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Check auth state and redirect if not authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
        setIsLoading(false)
      } else {
        router.push("http://localhost:3000/") // Redirect to login if not authenticated
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("http://localhost:3000/")
    } catch (err) {
      console.error("Logout error:", err)
    }
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return
      const newWidth = e.clientX
      if (newWidth >= 280 && newWidth <= 600) {
        setFormWidth(newWidth)
      }
    },
    [isResizing],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  const downloadPDF = useCallback(() => {
    if (!previewRef.current) return
    const input = previewRef.current
    html2canvas(input, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF("p", "mm", "a4")
      const imgWidth = 210 // A4 width in mm
      const pageHeight = 297 // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      pdf.save("cv.pdf")
    })
  }, [cvData, selectedTemplate])

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
    } else {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
      document.body.style.userSelect = ""
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-[1000]">
        <div className="relative">
          <div className="absolute -inset-4 rounded-full border-4 border-pink-200 border-t-pink-600 animate-spin"></div>
          <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-pink-100 bg-white px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">CV Builder</h1>
          <p className="text-sm text-gray-600">Create your professional resume in minutes</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-pink-100 flex items-center justify-center border border-pink-200">
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="text-sm font-medium text-pink-700">
                  {user?.displayName ? user.displayName.charAt(0).toUpperCase() : <User className="h-5 w-5" />}
                </span>
              )}
            </div>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-pink-600 flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
          <button
            onClick={downloadPDF}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-md shadow-sm"
          >
            Download PDF
          </button>
        </div>
      </header>
      {/* Main Content */}
      <div className="flex h-[calc(100vh-80px)]">
        {/* Left Panel - Forms */}
        <div
          className="border-r border-pink-100 bg-pink-50/30 overflow-y-auto relative"
          style={{ width: `${formWidth}px` }}
        >
          <CVForm cvData={cvData} setCVData={setCVData} formWidth={formWidth} />
          {/* Resize Handle */}
          <div
            ref={resizeRef}
            className="absolute top-0 right-0 w-1 h-full cursor-col-resize bg-transparent hover:bg-pink-300 transition-colors z-10"
            onMouseDown={handleMouseDown}
          >
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-0.5 h-8 bg-pink-400 opacity-0 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
        {/* Center Panel - Preview */}
        <div className="flex-1 bg-gray-50 p-4 overflow-y-auto min-w-0">
          <div className="w-full max-w-none flex justify-center">
            <div
              ref={previewRef}
              className="w-[210mm] min-h-[297mm] bg-white shadow-xl"
            >
              <CVPreview cvData={cvData} template={selectedTemplate} />
            </div>
          </div>
        </div>
        {/* Right Panel - Templates */}
        <div className="w-80 border-l border-pink-100 bg-white overflow-y-auto">
          <TemplateSelector selectedTemplate={selectedTemplate} onTemplateSelect={setSelectedTemplate} />
        </div>
      </div>
    </div>
  )
}
