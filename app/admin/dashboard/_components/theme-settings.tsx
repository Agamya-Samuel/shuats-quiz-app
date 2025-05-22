"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/hooks/use-toast"
import { Palette, Upload, Moon, Sun, Monitor, ImageIcon, Save, RefreshCw } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"

export function ThemeSettings() {
  const [themeSettings, setThemeSettings] = useState({
    mode: "system", // "light", "dark", "system"
    primaryColor: "#0284c7", // sky-600
    accentColor: "#7c3aed", // violet-600
    customLogo: null,
    customBackground: null,
    customCSS: "",
    showBranding: true,
    customFonts: false,
    fontPrimary: "Inter",
    fontSecondary: "Inter",
  })

  const updateThemeSetting = (key: string, value: string | boolean | null) => {
    setThemeSettings({
      ...themeSettings,
      [key]: value,
    })
  }

  const saveThemeSettings = () => {
    toast({
      title: "Theme Settings Saved",
      description: "Your theme and branding settings have been updated.",
      variant: "success",
    })
  }

  const resetThemeSettings = () => {
    setThemeSettings({
      mode: "system",
      primaryColor: "#0284c7",
      accentColor: "#7c3aed",
      customLogo: null,
      customBackground: null,
      customCSS: "",
      showBranding: true,
      customFonts: false,
      fontPrimary: "Inter",
      fontSecondary: "Inter",
    })

    toast({
      title: "Theme Reset",
      description: "Theme settings have been reset to defaults.",
      variant: "default",
    })
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="appearance">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
              <CardDescription>Customize the appearance of the quiz platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Color Mode</Label>
                <div className="flex flex-wrap gap-4">
                  <Button
                    variant={themeSettings.mode === "light" ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => updateThemeSetting("mode", "light")}
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </Button>
                  <Button
                    variant={themeSettings.mode === "dark" ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => updateThemeSetting("mode", "dark")}
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </Button>
                  <Button
                    variant={themeSettings.mode === "system" ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => updateThemeSetting("mode", "system")}
                  >
                    <Monitor className="h-4 w-4" />
                    System
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: themeSettings.primaryColor }}
                    />
                    <Input
                      id="primary-color"
                      type="color"
                      value={themeSettings.primaryColor}
                      onChange={(e) => updateThemeSetting("primaryColor", e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accent-color">Accent Color</Label>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border"
                      style={{ backgroundColor: themeSettings.accentColor }}
                    />
                    <Input
                      id="accent-color"
                      type="color"
                      value={themeSettings.accentColor}
                      onChange={(e) => updateThemeSetting("accentColor", e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="custom-fonts">Custom Fonts</Label>
                  <Switch
                    id="custom-fonts"
                    checked={themeSettings.customFonts}
                    onCheckedChange={(checked) => updateThemeSetting("customFonts", checked)}
                  />
                </div>

                {themeSettings.customFonts && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4 border-l-2 border-muted">
                    <div className="space-y-2">
                      <Label htmlFor="font-primary">Primary Font</Label>
                      <Select
                        value={themeSettings.fontPrimary}
                        onValueChange={(value) => updateThemeSetting("fontPrimary", value)}
                      >
                        <SelectTrigger id="font-primary">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="font-secondary">Secondary Font</Label>
                      <Select
                        value={themeSettings.fontSecondary}
                        onValueChange={(value) => updateThemeSetting("fontSecondary", value)}
                      >
                        <SelectTrigger id="font-secondary">
                          <SelectValue placeholder="Select font" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Inter">Inter</SelectItem>
                          <SelectItem value="Roboto">Roboto</SelectItem>
                          <SelectItem value="Open Sans">Open Sans</SelectItem>
                          <SelectItem value="Montserrat">Montserrat</SelectItem>
                          <SelectItem value="Poppins">Poppins</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="custom-css">Custom CSS</Label>
                <textarea
                  id="custom-css"
                  className="w-full min-h-[100px] p-2 border rounded-md font-mono text-sm"
                  placeholder=".quiz-container { background-color: #f8f9fa; }"
                  value={themeSettings.customCSS}
                  onChange={(e) => updateThemeSetting("customCSS", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Add custom CSS to further customize the appearance of the quiz platform
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetThemeSettings} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveThemeSettings} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Preview how your theme settings will look</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="border rounded-lg p-6 space-y-4"
                style={{
                  backgroundColor: themeSettings.mode === "dark" ? "#1f2937" : "#ffffff",
                  color: themeSettings.mode === "dark" ? "#f3f4f6" : "#1f2937",
                }}
              >
                <h3 className="text-xl font-bold" style={{ color: themeSettings.primaryColor }}>
                  Sample Quiz Title
                </h3>
                <p>This is how your quiz content will appear to users.</p>
                <div className="space-y-2">
                  <div
                    className="p-3 border rounded-md"
                    style={{
                      borderColor: themeSettings.mode === "dark" ? "#374151" : "#e5e7eb",
                    }}
                  >
                    <p className="font-medium">Question 1: What is the capital of France?</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ borderColor: themeSettings.accentColor }}
                        ></div>
                        <span>Paris</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ borderColor: themeSettings.accentColor }}
                        ></div>
                        <span>London</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ borderColor: themeSettings.accentColor }}
                        ></div>
                        <span>Berlin</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border"
                          style={{ borderColor: themeSettings.accentColor }}
                        ></div>
                        <span>Madrid</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 rounded-md text-white"
                    style={{ backgroundColor: themeSettings.primaryColor }}
                  >
                    Next Question
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Branding Settings</CardTitle>
              <CardDescription>Customize the branding elements of the quiz platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="platform-name">Platform Name</Label>
                <Input id="platform-name" placeholder="Quiz Master" defaultValue="Quiz Master" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="logo-upload">Logo</Label>
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center gap-2">
                    <div className="w-32 h-32 bg-muted rounded-md flex items-center justify-center">
                      {themeSettings.customLogo ? (
                        <Image
                          src={themeSettings.customLogo || "/placeholder.svg"}
                          alt="Custom logo"
                          className="max-w-full max-h-full object-contain"
                          width={128}
                          height={128}
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Logo
                      </Button>
                      {themeSettings.customLogo && (
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Recommended size: 200x200px, PNG or SVG format
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background-upload">Background Image</Label>
                  <div className="border rounded-md p-4 flex flex-col items-center justify-center gap-2">
                    <div className="w-full h-32 bg-muted rounded-md flex items-center justify-center">
                      {themeSettings.customBackground ? (
                        <Image
                          src={themeSettings.customBackground || "/placeholder.svg"}
                          alt="Custom background"
                          className="w-full h-full object-cover rounded-md"
                          width={128}
                          height={128}
                        />
                      ) : (
                        <ImageIcon className="h-10 w-10 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        Upload Background
                      </Button>
                      {themeSettings.customBackground && (
                        <Button variant="ghost" size="sm">
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Recommended size: 1920x1080px, JPG or PNG format
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-branding">Show Platform Branding</Label>
                    <p className="text-sm text-muted-foreground">Display the platform name and logo on all pages</p>
                  </div>
                  <Switch
                    id="show-branding"
                    checked={themeSettings.showBranding}
                    onCheckedChange={(checked) => updateThemeSetting("showBranding", checked)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="favicon-upload">Favicon</Label>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Favicon
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Recommended size: 32x32px, ICO or PNG format</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetThemeSettings} className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveThemeSettings} className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Preview how your branding will appear</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="bg-primary h-16 flex items-center px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
                      {themeSettings.customLogo ? (
                        <Image
                          src={themeSettings.customLogo || "/placeholder.svg"}
                          alt="Logo"
                          className="max-w-full max-h-full object-contain"
                          width={128}
                          height={128}
                        />
                      ) : (
                        <Palette className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    {themeSettings.showBranding && <span className="text-white font-bold">Quiz Master</span>}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    This is how your branding will appear in the header of the quiz platform
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
