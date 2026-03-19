"use client"

import * as React from "react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { SettingsIcon } from "lucide-react"

interface Settings {
  autoAdvance: boolean
}

const STORAGE_KEY = "einsatzsim-settings"

function loadSettings(): Settings {
  if (typeof window === "undefined") return { autoAdvance: false }
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        autoAdvance: parsed.autoAdvance ?? false,
      }
    }
  } catch (e) {
    console.error("Failed to load settings:", e)
  }
  return { autoAdvance: false }
}

function saveSettings(settings: Settings) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
  } catch (e) {
    console.error("Failed to save settings:", e)
  }
}

interface SettingsDialogProps {
  children?: React.ReactNode
  onSettingsChange?: (settings: Settings) => void
}

export function SettingsDialog({
  children,
  onSettingsChange,
}: SettingsDialogProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [settings, setSettings] = React.useState<Settings>(() => {
    // Initialize from localStorage
    if (typeof window !== "undefined") {
      return loadSettings()
    }
    return { autoAdvance: false }
  })

  const handleAutoAdvanceChange = (checked: boolean) => {
    const newSettings = { ...settings, autoAdvance: checked }
    setSettings(newSettings)
    saveSettings(newSettings)
    if (onSettingsChange) {
      onSettingsChange(newSettings)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <SettingsIcon className="size-5" />
            <span className="sr-only">Einstellungen</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Einstellungen</DialogTitle>
          <DialogDescription>
            Anpassen des Verhaltens der Einsatzanzeige
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="autoAdvance">
              Automatisch weiter
              <span className="block text-xs font-normal text-muted-foreground">
                Zustände automatisch wechseln
              </span>
            </Label>
            <Switch
              id="autoAdvance"
              checked={settings.autoAdvance}
              onCheckedChange={handleAutoAdvanceChange}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Schließen
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { loadSettings, saveSettings }
export type { Settings }
