import { useAppContext } from "@/context/AppContext"
import { useFileSystem } from "@/context/FileContext"
import { useSettings } from "@/context/SettingContext"
import { useSocket } from "@/context/SocketContext"
import usePageEvents from "@/hooks/usePageEvents"
import useResponsive from "@/hooks/useResponsive"
import { editorThemes } from "@/resources/Themes"
import { FileSystemItem } from "@/types/file"
import { SocketEvent } from "@/types/socket"

import { color } from "@uiw/codemirror-extensions-color"
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link"
import { loadLanguage } from "@uiw/codemirror-extensions-langs"

import CodeMirror, {
    Extension,
    ViewUpdate,
    scrollPastEnd,
} from "@uiw/react-codemirror"

import { EditorView } from "@codemirror/view"
import { useEffect, useMemo, useState, useRef, useCallback } from "react"
import toast from "react-hot-toast"

import {
    collaborativeHighlighting,
    updateRemoteUsers,
} from "./collaborativeHighlighting"

/* ---------------- LANGUAGE NORMALIZER ---------------- */

function normalizeLanguage(lang: string): string | null {
    const map: Record<string, string> = {
        js: "js",
        javascript: "js",
        jsx: "jsx",
        ts: "ts",
        typescript: "ts",
        tsx: "tsx",
        html: "html",
        css: "css",
        json: "json",
        py: "py",
        python: "py",
        java: "java",
        c: "c",
        cpp: "c++",
    }

    return map[lang?.toLowerCase()] ?? null
}

/* ---------------- EDITOR ---------------- */

function Editor() {
    const { users, currentUser } = useAppContext()
    const { activeFile, setActiveFile } = useFileSystem()
    const { theme, language, fontSize } = useSettings()
    const { socket } = useSocket()
    const { viewHeight } = useResponsive()

    const filteredUsers = useMemo(
        () => users.filter((u) => u.username !== currentUser.username),
        [users, currentUser],
    )

    const [extensions, setExtensions] = useState<Extension[]>([])
    const editorRef = useRef<any>(null)

    const [timeOut, setTimeOut] = useState(setTimeout(() => {}, 0))
    const [lastCursorPosition, setLastCursorPosition] = useState(0)
    const [lastSelection, setLastSelection] = useState<{
        start?: number
        end?: number
    }>({})

    const cursorMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    /* ---------------- CODE CHANGE ---------------- */

    const onCodeChange = (code: string, view: ViewUpdate) => {
        if (!activeFile) return

        const file: FileSystemItem = { ...activeFile, content: code }
        setActiveFile(file)

        const selection = view.state?.selection?.main
        const cursorPosition = selection?.head || 0
        const selectionStart = selection?.from
        const selectionEnd = selection?.to

        socket.emit(SocketEvent.TYPING_START, {
            cursorPosition,
            selectionStart,
            selectionEnd,
        })

        socket.emit(SocketEvent.FILE_UPDATED, {
            fileId: activeFile.id,
            newContent: code,
        })

        clearTimeout(timeOut)

        const newTimeOut = setTimeout(
            () => socket.emit(SocketEvent.TYPING_PAUSE),
            1000,
        )

        setTimeOut(newTimeOut)
    }

    /* ---------------- CURSOR MOVE ---------------- */

    const handleSelectionChange = useCallback(
        (view: ViewUpdate) => {
            if (!view.selectionSet) return

            const selection = view.state?.selection?.main
            const cursorPosition = selection?.head || 0
            const selectionStart = selection?.from
            const selectionEnd = selection?.to

            const cursorChanged = cursorPosition !== lastCursorPosition
            const selectionChanged =
                selectionStart !== lastSelection.start ||
                selectionEnd !== lastSelection.end

            if (cursorChanged || selectionChanged) {
                setLastCursorPosition(cursorPosition)
                setLastSelection({ start: selectionStart, end: selectionEnd })

                if (cursorMoveTimeoutRef.current) {
                    clearTimeout(cursorMoveTimeoutRef.current)
                }

                cursorMoveTimeoutRef.current = setTimeout(() => {
                    socket.emit(SocketEvent.CURSOR_MOVE, {
                        cursorPosition,
                        selectionStart,
                        selectionEnd,
                    })
                }, 100)
            }
        },
        [lastCursorPosition, lastSelection, socket],
    )

    usePageEvents()

    /* ---------------- EXTENSIONS ---------------- */

    useEffect(() => {
        const exts: Extension[] = [
            color,
            hyperLink,
            collaborativeHighlighting(),
            EditorView.updateListener.of(handleSelectionChange),
            scrollPastEnd(),
        ]

        const normalizedLang = normalizeLanguage(language)
        const langExt = normalizedLang
            ? loadLanguage(normalizedLang as any)
            : null

        if (langExt) {
            exts.push(langExt)
        } else {
            toast.error("Syntax highlighting unavailable", {
                id: "syntax-error",
            })
        }

        setExtensions(exts)
    }, [filteredUsers, language, handleSelectionChange])

    /* ---------------- REMOTE USERS ---------------- */

    useEffect(() => {
        if (editorRef.current?.view) {
            editorRef.current.view.dispatch({
                effects: updateRemoteUsers.of(filteredUsers),
            })
        }
    }, [filteredUsers])

    return (
        <CodeMirror
            ref={editorRef}
            theme={editorThemes[theme]}
            value={activeFile?.content}
            onChange={onCodeChange}
            extensions={extensions}
            minHeight="100%"
            maxWidth="100vw"
            style={{
                fontSize: fontSize + "px",
                height: viewHeight,
                position: "relative",
            }}
        />
    )
}

export default Editor
