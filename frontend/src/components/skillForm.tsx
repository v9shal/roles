import React, { ChangeEvent } from 'react';
import axios from 'axios';

interface SkillFormProps {
  formData: {
    [key: string]: string;
  };
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setError: (error: string) => void;
}

const SkillForm: React.FC<SkillFormProps> = ({ formData, handleInputChange, setError }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="skillName">
          Skill Title
        </label>
        <input
          id="skillName"
          type="text"
          name="skillName"
          value={formData.skillName || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="skillDescription">
          Description of the skill
        </label>
        <textarea
          id="skillDescription"
          name="description"
          value={formData.description || ''}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        ></textarea>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="proficiency">
          Proficiency Level
        </label>
        <select
          id="proficiency"
          name="proficiency"
          value={formData.proficiency || ''}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </select>
      </div>
    </div>
  );
};

export const postSkill = async (data: {[key: string]: string}) => {
  try {
    // Prepare the skill data
    const skillData = {
      title: data.skillName,
      description: data.description,
      proficiency: data.proficiency,
      ownerId: 'cmahvgh7c0002lil4q0tnpcfx' // Replace with actual owner ID from auth context
    };
    
    console.log('Submitting skill data:', skillData);
    
    const response = await axios.post('http://localhost:3000/api/skills/uploadskills', skillData);
    console.log('Skill posted successfully:', response.data);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Error posting skill:', error);
    if (error.response && error.response.data) {
      console.error('Server error details:', error.response.data);
    }
    return { success: false, error };
  }
};

export default SkillForm;