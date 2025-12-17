import { useChatRoom } from "@/context/ChatContext"
import { useViews } from "@/context/ViewContext"
import { VIEWS } from "@/types/view"
import { Tooltip } from "react-tooltip"
import "react-tooltip/dist/react-tooltip.css"
import { buttonStyles, tooltipStyles } from "../tooltipStyles"

interface ViewButtonProps {
    viewName: VIEWS
    icon: JSX.Element
}

const ViewButton = ({ viewName, icon }: ViewButtonProps) => {
    const { activeView, setActiveView, isSidebarOpen, setIsSidebarOpen } =
        useViews()
    const { isNewMessage } = useChatRoom()

    const handleViewClick = (viewName: VIEWS) => {
        if (viewName === activeView) {
            setIsSidebarOpen(!isSidebarOpen)
        } else {
            setIsSidebarOpen(true)
            setActiveView(viewName)
        }
    }

    return (
        <div className="relative flex flex-col items-center">
            <button
                onClick={() => handleViewClick(viewName)}
                className={`${buttonStyles.base} ${buttonStyles.hover}`}
                data-tooltip-id={`tooltip-${viewName}`}
                data-tooltip-content={viewName}
            >
                <div className="flex items-center justify-center">{icon}</div>

                {/* New message indicator */}
                {viewName === VIEWS.CHATS && isNewMessage && (
                    <div className="absolute right-0 top-0 h-3 w-3 rounded-full bg-primary" />
                )}
            </button>

            <Tooltip
                id={`tooltip-${viewName}`}
                place="right"
                offset={25}
                className="!z-50"
                style={tooltipStyles}
                positionStrategy="fixed"
            />
        </div>
    )
}

export default ViewButton
