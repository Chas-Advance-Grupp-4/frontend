import {Moon, Sun} from 'lucide-react';
import useTheme from '../hooks/useTheme';

export function ToggleTheme() {
    const {theme, toggleTheme} = useTheme();

    return (
        <button onClick={toggleTheme} 
            title="change theme" 
            aria-label="Toggle theme">
            {theme === "dark" ? 
                <Sun size={20} className="text-white" /> 
                : 
                <Moon size={20} className="text-black" />}  
        </button>
    );
}

export default ToggleTheme;